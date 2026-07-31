import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendEvent, getClientIp, getUserAgent } from './fb-capi.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 48) || 'org'
}

const PLAN_PRICES = {
  essential:    { monthly: 199, quarterly: 179, semi_annual: 159, annual: 139 },
  professional: { monthly: 299, quarterly: 269, semi_annual: 239, annual: 209 },
  business:     { monthly: 599, quarterly: 539, semi_annual: 479, annual: 419 },
}

/**
 * Provisions a subscription: creates Stripe subscription, auth user, org, org_users,
 * org_subscriptions, partner webhook, FB CAPI event, and magic link.
 *
 * @param {object} params
 * @param {string} params.customerId - Stripe customer ID
 * @param {string} params.paymentMethodId - Stripe payment method ID
 * @param {string} params.email
 * @param {string} params.firstName
 * @param {string} params.lastName
 * @param {string} params.company
 * @param {string} params.phone
 * @param {string} params.password
 * @param {string} params.planKey - 'essential' | 'professional' | 'business'
 * @param {string} params.billingKey - 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
 * @param {string} params.priceId - Stripe price ID
 * @param {string|null} params.promoCode
 * @param {boolean} params.addDedicatedSupport
 * @param {boolean} params.addReactivation
 * @param {boolean} params.addSetup
 * @param {string} params.partnerRef
 * @param {string} params.fbc
 * @param {string} params.fbp
 * @param {object} params.req - original request (for IP/UA)
 * @returns {{ success: boolean, redirect_url: string, subscription: object, requires_action?: boolean, client_secret?: string, subscription_id?: string }}
 */
export async function provisionSubscription(params) {
  const {
    customerId, paymentMethodId, email, firstName, lastName, company, phone, password,
    planKey, billingKey, priceId, promoCode,
    addDedicatedSupport, addReactivation, addSetup,
    partnerRef, fbc, fbp, req,
  } = params

  const isBusiness = planKey === 'business'
  const price = PLAN_PRICES[planKey]?.[billingKey] || 0

  // 1. Validate promo code if provided
  let stripePromoId = null
  if (promoCode) {
    const { data: promo } = await supabase
      .from('promo_codes')
      .select('stripe_promo_id, expires_at, used')
      .eq('code', promoCode.toUpperCase())
      .single()

    if (promo && !promo.used && new Date(promo.expires_at) > new Date() && promo.stripe_promo_id) {
      stripePromoId = promo.stripe_promo_id
    }
  }

  // 2. Create subscription (Business = no trial, others = 3-day trial)
  const items = [{ price: priceId }]
  if (addDedicatedSupport && process.env.STRIPE_PRICE_SUPPORT_MONTHLY) {
    items.push({ price: process.env.STRIPE_PRICE_SUPPORT_MONTHLY })
  }

  const addInvoiceItems = []
  if (addReactivation && process.env.STRIPE_PRICE_REACTIVATION_ONETIME) {
    addInvoiceItems.push({ price: process.env.STRIPE_PRICE_REACTIVATION_ONETIME })
  }
  if (addSetup && process.env.STRIPE_PRICE_SETUP_ONETIME) {
    addInvoiceItems.push({ price: process.env.STRIPE_PRICE_SETUP_ONETIME })
  }

  const subscriptionParams = {
    customer: customerId,
    items,
    ...(addInvoiceItems.length > 0 && { add_invoice_items: addInvoiceItems }),
    payment_settings: {
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  }
  if (!isBusiness) {
    subscriptionParams.trial_period_days = 3
  }
  if (stripePromoId) {
    subscriptionParams.promotion_code = stripePromoId
  }
  const subscription = await stripe.subscriptions.create(subscriptionParams)

  // 2b. Business plan: handle immediate payment + 3DS
  if (isBusiness) {
    const paymentIntent = subscription.latest_invoice?.payment_intent
    if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
      throw new Error('Payment failed. Please try a different card.')
    }
  }

  // 3. Get or create auth user
  const { data: leadRow } = await supabase
    .from('signup_leads')
    .select('user_id')
    .eq('email', email.toLowerCase())
    .single()

  let userId = leadRow?.user_id

  if (userId) {
    const { error: updateErr } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        company,
        phone: phone || null,
        plan: planKey,
        billing: billingKey,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        trial_ends_at: isBusiness ? null : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })
    if (updateErr) {
      console.warn('updateUserById failed (user may have been deleted), creating new user:', updateErr.message)
      userId = null
    }
  }

  if (!userId) {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: password || Math.random().toString(36).slice(2) + 'A1!',
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        company,
        phone: phone || null,
        plan: planKey,
        billing: billingKey,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        trial_ends_at: isBusiness ? null : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })

    if (authError) {
      if (authError.message?.includes('already')) {
        const { data: linkData } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: email.toLowerCase(),
        })
        userId = linkData?.user?.id
      } else {
        throw new Error(authError.message)
      }
    } else {
      userId = authData?.user?.id
    }

    if (!userId) {
      throw new Error('User creation failed')
    }

    await supabase
      .from('signup_leads')
      .update({ user_id: userId })
      .eq('email', email.toLowerCase())
  }

  // 4. Create organization + org_users record
  const slug = generateSlug(company || firstName || 'org')

  let finalSlug = slug
  const { data: existing } = await supabase
    .from('organizations')
    .select('slug')
    .like('slug', `${slug}%`)

  if (existing && existing.length > 0) {
    finalSlug = `${slug}-${existing.length + 1}`
  }

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: company || `${firstName}'s Clinic`,
      slug: finalSlug,
      sector: 'clinic',
      status: 'onboarding',
      onboarding_status: 'in_progress',
      email,
      phone: phone || null,
      country: 'GB',
    })
    .select('id')
    .single()

  if (orgError) {
    throw new Error(`Organization creation failed: ${orgError.message}`)
  }

  const { error: orgUserError } = await supabase
    .from('org_users')
    .insert({
      user_id: userId,
      organization_id: org.id,
      role: 'admin',
    })

  if (orgUserError) {
    throw new Error(`Org user link failed: ${orgUserError.message}`)
  }

  // 4b. Add metadata to Stripe subscription + create org_subscriptions record
  await stripe.subscriptions.update(subscription.id, {
    metadata: {
      organization_id: org.id,
      plan_id: planKey,
      add_ons: JSON.stringify({
        support: !!addDedicatedSupport,
        reactivation: !!addReactivation,
        setup: !!addSetup,
      }),
    },
  })

  const trialEndsAt = isBusiness ? null : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from('org_subscriptions').insert({
    organization_id: org.id,
    plan_id: planKey,
    status: isBusiness ? 'active' : 'trialing',
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    billing_interval: billingKey,
    trial_ends_at: trialEndsAt,
    current_period_start: new Date().toISOString(),
    current_period_end: isBusiness
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  })

  // 5. Notify partner panel if referred
  if (partnerRef) {
    try {
      await fetch('https://partner.stoaix.com/api/webhook/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PARTNER_WEBHOOK_SECRET}`,
        },
        body: JSON.stringify({
          organization_id: org.id,
          org_name: company || `${firstName}'s Clinic`,
          plan_type: planKey,
          monthly_price: price,
          referral_code: partnerRef,
        }),
      })
    } catch (err) {
      console.error('Partner webhook error:', err)
    }
  }

  // 5b. Mark promo code as used
  if (promoCode && stripePromoId) {
    await supabase
      .from('promo_codes')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('code', promoCode.toUpperCase())
  }

  // 6. Mark lead as converted + FB CAPI Purchase event
  await supabase
    .from('signup_leads')
    .update({ converted: true, converted_at: new Date().toISOString() })
    .eq('email', email.toLowerCase())

  const planName = PLAN_PRICES[planKey] ? planKey.charAt(0).toUpperCase() + planKey.slice(1) : planKey
  let eventValue = price
  if (addDedicatedSupport) eventValue += 99
  if (addReactivation)     eventValue += 29.99
  if (addSetup)            eventValue += 99
  sendEvent({
    eventName: 'Purchase',
    email,
    firstName,
    lastName,
    value: eventValue,
    sourceUrl: 'https://stoaix.com/checkout',
    clientIp: getClientIp(req),
    clientUserAgent: getUserAgent(req),
    fbc,
    fbp,
    contentName: `${planName} Plan`,
    contentCategory: 'subscription',
    contentIds: planKey,
  }).catch(() => {})

  // 7. Generate magic link
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: 'https://platform.stoaix.com/auth/callback?next=/onboarding',
    },
  })

  const redirectUrl = linkError || !linkData?.properties?.action_link
    ? 'https://platform.stoaix.com/login'
    : linkData.properties.action_link

  // Business plan with 3DS: return client_secret so frontend can confirm payment
  if (isBusiness) {
    const paymentIntent = subscription.latest_invoice?.payment_intent
    if (paymentIntent && paymentIntent.status === 'requires_action') {
      return {
        success: true,
        requires_action: true,
        client_secret: paymentIntent.client_secret,
        subscription_id: subscription.id,
        redirect_url: redirectUrl,
      }
    }
  }

  return {
    success: true,
    redirect_url: redirectUrl,
  }
}

// ─────────────────────────────────────────────────────────────
// MODÜL PROVİZYONU (à la carte, plan_id='clinic_tools') — free-trial provisionSubscription'dan
// TAMAMEN AYRI FONKSİYON (canlı free-trial akışına SIFIR dokunuş — kod-review §7.4).
// Kod-review 3 BLOCKER:
//  #1 email→mevcut org lookup: mevcut kullanıcının org'u VARSA modülü ONA ekle (yeni org AÇMA); yoksa yeni clinic_tools org.
//  #2 organizations.plan_id='clinic_tools' AÇIKÇA (yeni org'da) — middleware guard bunu okur; org_subscriptions YETMEZ.
//  #3 crm_config.social_media.enabled MERGE (mevcut config'i EZMEDEN) — sosyal medya gate crm_config'de (feature-gate.ts).
// Modül = deneme YOK (ilk fatura hemen; 3DS PaymentIntent ile — Business deseni).
// ─────────────────────────────────────────────────────────────
export async function provisionModules(params) {
  const {
    customerId, email, firstName, lastName, company, phone, password,
    productKeys, priceIds, featureKeys, crmFlags, req, fbc, fbp,
  } = params

  const lowerEmail = email.toLowerCase()

  // 1. Stripe subscription (deneme YOK → ilk fatura hemen; 3DS olabilir)
  // Idempotency (A4): aynı müşteri+ürün seti için retry/anlık-race çift abonelik/çift fatura oluşturmasın (Stripe 24s cache).
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: priceIds.map((price) => ({ price })),
    payment_settings: { payment_method_types: ['card'], save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  }, {
    idempotencyKey: `modsub_${lowerEmail}_${priceIds.slice().sort().join('_')}`,
  })
  const paymentIntent = subscription.latest_invoice?.payment_intent
  if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
    throw new Error('Payment failed. Please try a different card.')
  }

  // 2. Auth user: oluştur; zaten varsa mevcut kullanıcı (generateLink → userId). getUserByEmail'e güvenme.
  let userId = null
  let isExistingUser = false
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: lowerEmail,
    password: password || Math.random().toString(36).slice(2) + 'A1!',
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName, company, phone: phone || null, stripe_customer_id: customerId },
  })
  if (authError) {
    if (authError.message?.includes('already')) {
      isExistingUser = true
      const { data: linkData } = await supabase.auth.admin.generateLink({ type: 'magiclink', email: lowerEmail })
      userId = linkData?.user?.id
    } else {
      throw new Error(authError.message)
    }
  } else {
    userId = authData?.user?.id
  }
  if (!userId) throw new Error('User creation failed')

  // 3. [BLOCKER #1] email→org lookup: mevcut kullanıcının org'u var mı?
  let orgId = null
  let isNewOrg = false
  if (isExistingUser) {
    const { data: existingOrgUser } = await supabase
      .from('org_users')
      .select('organization_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (existingOrgUser?.organization_id) {
      orgId = existingOrgUser.organization_id // MEVCUT org'a modül EKLE (yeni org AÇMA — çift-org önlenir)
    }
  }

  // 4. Mevcut org yoksa → yeni clinic_tools org [BLOCKER #2: plan_id AÇIKÇA]
  if (!orgId) {
    isNewOrg = true
    const slug = generateSlug(company || firstName || 'clinic')
    let finalSlug = slug
    const { data: existing } = await supabase.from('organizations').select('slug').like('slug', `${slug}%`)
    if (existing && existing.length > 0) finalSlug = `${slug}-${existing.length + 1}`

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: company || `${firstName}'s Clinic`,
        slug: finalSlug,
        sector: 'clinic',           // clinic_tools invariant (smileDesignEnabled sector kapısı)
        plan_id: 'clinic_tools',    // [#2] middleware guard organizations.plan_id okur — org_subscriptions YETMEZ
        status: 'active',           // araç-only: onboarding wizard yok
        onboarding_status: 'completed',
        email: lowerEmail,
        phone: phone || null,
        country: 'GB',
      })
      .select('id')
      .single()
    if (orgError) throw new Error(`Organization creation failed: ${orgError.message}`)
    orgId = org.id
    await supabase.from('org_users').insert({ user_id: userId, organization_id: orgId, role: 'admin' })
  }

  // 5. Her feature → org_entitlement_overrides upsert (enabled)
  for (const fk of featureKeys) {
    await supabase.from('org_entitlement_overrides').upsert(
      { organization_id: orgId, feature_key: fk, enabled: true, reason: `self_serve:${subscription.id}` },
      { onConflict: 'organization_id,feature_key' }
    )
  }

  // 6. [BLOCKER #3] crm_config MERGE (sosyal medya için ŞART; mevcut config EZİLMEZ)
  if (crmFlags && crmFlags.length > 0) {
    const { data: orgRow } = await supabase.from('organizations').select('crm_config').eq('id', orgId).single()
    const crm = (orgRow?.crm_config && typeof orgRow.crm_config === 'object') ? { ...orgRow.crm_config } : {}
    for (const flag of crmFlags) {
      crm[flag] = { ...(crm[flag] || {}), enabled: true }
    }
    await supabase.from('organizations').update({ crm_config: crm }).eq('id', orgId)
  }

  // 7. org_subscriptions: YALNIZ yeni clinic_tools org için (mevcut org'un plan sub'ını EZME — organization_id UNIQUE)
  if (isNewOrg) {
    await supabase.from('org_subscriptions').insert({
      organization_id: orgId,
      plan_id: 'clinic_tools',
      status: 'active',
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      billing_interval: 'monthly',
      trial_ends_at: null,
      current_period_start: new Date().toISOString(),
      current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
    })
  }

  // 8. Stripe subscription metadata (webhook + izlenebilirlik)
  await stripe.subscriptions.update(subscription.id, {
    metadata: { organization_id: orgId, plan_id: 'clinic_tools', module_products: productKeys.join(','), feature_keys: featureKeys.join(','), crm_flags: crmFlags.join(','), self_serve_modules: '1' },
  })

  // 9. signup_leads (varsa) converted + FB CAPI Purchase
  await supabase.from('signup_leads').update({ converted: true, converted_at: new Date().toISOString() }).eq('email', lowerEmail)
  sendEvent({
    eventName: 'Purchase', email, firstName, lastName,
    value: 0, sourceUrl: 'https://stoaix.com/modules-checkout',
    clientIp: getClientIp(req), clientUserAgent: getUserAgent(req), fbc, fbp,
    contentName: productKeys.join('+'), contentCategory: 'module', contentIds: productKeys.join(','),
  }).catch(() => {})

  // 10. Magic link → platform (araç-only org middleware dinamik landing'e yönlendirir)
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink', email: lowerEmail,
    options: { redirectTo: 'https://platform.stoaix.com/auth/callback?next=/dashboard' },
  })
  const redirectUrl = linkError || !linkData?.properties?.action_link
    ? 'https://platform.stoaix.com/login'
    : linkData.properties.action_link

  // 3DS gerekiyorsa client_secret döndür (Business deseni — client confirmCardPayment)
  if (paymentIntent && paymentIntent.status === 'requires_action') {
    return { success: true, requires_action: true, client_secret: paymentIntent.client_secret, subscription_id: subscription.id, redirect_url: redirectUrl }
  }
  return { success: true, redirect_url: redirectUrl }
}

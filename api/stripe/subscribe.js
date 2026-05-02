import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendEvent, getClientIp, getUserAgent } from '../_lib/fb-capi.js'

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

const PRICE_MAP = {
  essential: {
    monthly: process.env.STRIPE_PRICE_ESSENTIAL_MONTHLY,
    annual:  process.env.STRIPE_PRICE_ESSENTIAL_ANNUAL,
  },
  professional: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    annual:  process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
  },
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).setHeaders(CORS).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

  const { email, firstName, lastName, company, phone, plan, billing, paymentMethodId, partnerRef, fbc, fbp, addDedicatedSupport, addReactivation, addSetup } = req.body

  if (!email || !plan || !billing || !paymentMethodId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const planKey = plan.toLowerCase()
  const billingKey = billing === 'annual' ? 'annual' : 'monthly'
  const priceId = PRICE_MAP[planKey]?.[billingKey]

  const PLAN_PRICES = {
    essential:    { monthly: 99,  annual: 79  },
    professional: { monthly: 199, annual: 159 },
    business:     { monthly: 399, annual: 319 },
  }
  const price = PLAN_PRICES[planKey]?.[billingKey] || 0

  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan or billing period' })
  }

  try {
    // 1. Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`.trim(),
      phone: phone || undefined,
      metadata: { company: company || '', plan: planKey, billing: billingKey },
    })

    // 2. Attach payment method
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id })
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    // 3. Create subscription (Business = no trial, others = 7-day trial)
    const isBusiness = planKey === 'business'

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
      customer: customer.id,
      items,
      ...(addInvoiceItems.length > 0 && { add_invoice_items: addInvoiceItems }),
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    }
    if (!isBusiness) {
      subscriptionParams.trial_period_days = 7
    }
    const subscription = await stripe.subscriptions.create(subscriptionParams)

    // 3b. Business plan: handle immediate payment + 3DS
    if (isBusiness) {
      const paymentIntent = subscription.latest_invoice?.payment_intent
      if (paymentIntent && paymentIntent.status === 'requires_action') {
        // 3DS required — create user/org first, then return client_secret
        // so frontend can complete 3DS and user record already exists
      }
      if (paymentIntent && paymentIntent.status === 'requires_payment_method') {
        return res.status(400).json({ error: 'Payment failed. Please try a different card.' })
      }
    }

    // 4. Get existing user from signup_leads (created during OTP verification)
    const { data: leadRow } = await supabase
      .from('signup_leads')
      .select('user_id')
      .eq('email', email.toLowerCase())
      .single()

    let userId = leadRow?.user_id

    if (userId) {
      // User exists (hybrid flow) — update metadata with Stripe info
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          company,
          phone: phone || null,
          plan: planKey,
          billing: billingKey,
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          trial_ends_at: isBusiness ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      })
    } else {
      // Legacy fallback: user_id not set (old leads before hybrid flow)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: req.body.password || Math.random().toString(36).slice(2) + 'A1!',
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName,
          company,
          phone: phone || null,
          plan: planKey,
          billing: billingKey,
          stripe_customer_id: customer.id,
          stripe_subscription_id: subscription.id,
          trial_ends_at: isBusiness ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      })

      if (authError) {
        if (authError.message?.includes('already')) {
          // User exists — look up via generateLink
          const { data: linkData } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: email.toLowerCase(),
          })
          userId = linkData?.user?.id
        } else {
          return res.status(400).json({ error: authError.message })
        }
      } else {
        userId = authData?.user?.id
      }

      if (!userId) {
        return res.status(500).json({ error: 'User creation failed' })
      }
    }

    // 5. Create organization + org_users record
    const slug = generateSlug(company || firstName || 'org')

    // Check slug uniqueness, append number if needed
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
      return res.status(500).json({ error: `Organization creation failed: ${orgError.message}` })
    }

    const { error: orgUserError } = await supabase
      .from('org_users')
      .insert({
        user_id: userId,
        organization_id: org.id,
        role: 'admin',
      })

    if (orgUserError) {
      return res.status(500).json({ error: `Org user link failed: ${orgUserError.message}` })
    }

    // 5b. Add metadata to Stripe subscription + create org_subscriptions record
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

    const trialEndsAt = isBusiness ? null : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    await supabase.from('org_subscriptions').insert({
      organization_id: org.id,
      plan_id: planKey,
      status: isBusiness ? 'active' : 'trialing',
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      billing_interval: billingKey,
      trial_ends_at: trialEndsAt,
      current_period_start: new Date().toISOString(),
      current_period_end: isBusiness
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })

    // 6. Notify partner panel if referred
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

    // 7. Mark lead as converted + FB CAPI Purchase event
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

    // 7. Generate magic link → platform.stoaix.com/auth/callback → onboarding
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
        return res.status(200).json({
          success: true,
          requires_action: true,
          client_secret: paymentIntent.client_secret,
          subscription_id: subscription.id,
          redirect_url: redirectUrl,
        })
      }
    }

    return res.status(200).json({
      success: true,
      redirect_url: redirectUrl,
    })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: err.message || 'Subscription failed' })
  }
}

import Stripe from 'stripe'
import {
  provisionSubscription, provisionModules, provisionEntryPackage,
  ENTRY_PLAN_ID, resolveEntryPriceId, findExistingOrgForEmail, resolvePromoId,
} from '../_lib/provision.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICE_MAP = {
  essential: {
    monthly:     process.env.STRIPE_PRICE_ESSENTIAL_MONTHLY,
    quarterly:   process.env.STRIPE_PRICE_ESSENTIAL_QUARTERLY,
    semi_annual: process.env.STRIPE_PRICE_ESSENTIAL_SEMI_ANNUAL,
    annual:      process.env.STRIPE_PRICE_ESSENTIAL_ANNUAL,
  },
  professional: {
    monthly:     process.env.STRIPE_PRICE_PRO_MONTHLY,
    quarterly:   process.env.STRIPE_PRICE_PRO_QUARTERLY,
    semi_annual: process.env.STRIPE_PRICE_PRO_SEMI_ANNUAL,
    annual:      process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  business: {
    monthly:     process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    quarterly:   process.env.STRIPE_PRICE_BUSINESS_QUARTERLY,
    semi_annual: process.env.STRIPE_PRICE_BUSINESS_SEMI_ANNUAL,
    annual:      process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
  },
}

// À la carte modül kataloğu (server-side; client yalnız product_keys gönderir, fiyat/feature server çözer).
// key → { priceEnv, featureKeys[], crmFlags[] }. crmFlags = crm_config.<x>.enabled set edilecek (sosyal medya gate'i).
const MODULE_CATALOG = {
  smile_design:  { priceEnv: 'STRIPE_PRICE_SMILE_DESIGN_MONTHLY', featureKeys: ['smile_design'], crmFlags: [] },
  social_media:  { priceEnv: 'STRIPE_PRICE_SOCIAL_MEDIA_MONTHLY', featureKeys: ['social_media'], crmFlags: ['social_media'] },
  bundle_klinik: { priceEnv: 'STRIPE_PRICE_BUNDLE_KLINIK_MONTHLY', featureKeys: ['smile_design', 'social_media'], crmFlags: ['social_media'] },
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

  // ── Confirm-setup flow (post-3DS for trial plans) ──
  if (req.body.setupIntentId) {
    return handleConfirmSetup(req, res)
  }

  // ── Modül satın alma dalı (à la carte, deneme yok) — free-trial/plan dalına DOKUNMAZ ──
  if (Array.isArray(req.body.product_keys) && req.body.product_keys.length > 0) {
    return handleModuleSubscribe(req, res)
  }

  // ── Giriş paketi (yazili_resepsiyonist, deneme yok) — AYRI dal; essential/modül akışına dokunmaz ──
  if (req.body.entrySubscriptionId) {
    return handleEntryConfirm(req, res)
  }
  if (String(req.body.plan || '').toLowerCase() === ENTRY_PLAN_ID) {
    return handleEntrySubscribe(req, res)
  }

  // ── Normal subscribe flow ──
  const { email, firstName, lastName, company, phone, plan, billing, paymentMethodId, partnerRef, fbc, fbp, addDedicatedSupport, addReactivation, addSetup, promoCode } = req.body

  if (!email || !plan || !billing || !paymentMethodId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const planKey = plan.toLowerCase()
  const isBusiness = planKey === 'business'
  const VALID_INTERVALS = ['monthly', 'quarterly', 'semi_annual', 'annual']
  const billingKey = VALID_INTERVALS.includes(billing) ? billing : 'monthly'
  const priceId = PRICE_MAP[planKey]?.[billingKey]

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

    // 2. Attach payment method — trial plans use SetupIntent (supports 3DS),
    //    Business plan uses direct attach (3DS handled via PaymentIntent later)
    if (isBusiness) {
      await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id })
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      })
    } else {
      // Trial plans: use SetupIntent so 3DS can be handled client-side
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method: paymentMethodId,
        confirm: true,
        usage: 'off_session',
        payment_method_types: ['card'],
      })

      if (setupIntent.status === 'requires_action') {
        // 3DS required — return client_secret so frontend can complete authentication
        return res.status(200).json({
          success: true,
          requires_setup_action: true,
          setup_client_secret: setupIntent.client_secret,
          setup_intent_id: setupIntent.id,
          customer_id: customer.id,
        })
      }

      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ error: 'Card setup failed. Please try a different card.' })
      }

      // SetupIntent succeeded without 3DS — set default payment method and continue
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      })
    }

    // 3. Provision subscription, user, org, etc.
    const result = await provisionSubscription({
      customerId: customer.id,
      paymentMethodId,
      email,
      firstName,
      lastName,
      company,
      phone,
      password: req.body.password,
      planKey,
      billingKey,
      priceId,
      promoCode,
      addDedicatedSupport,
      addReactivation,
      addSetup,
      partnerRef,
      fbc,
      fbp,
      req,
    })

    return res.status(200).json(result)
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: err.message || 'Subscription failed' })
  }
}

// ── Post-3DS confirm-setup handler ──
async function handleConfirmSetup(req, res) {
  const {
    setupIntentId, customerId,
    email, firstName, lastName, company, phone, password,
    plan, billing,
    partnerRef, fbc, fbp,
    addDedicatedSupport, addReactivation, addSetup, promoCode,
  } = req.body

  if (!setupIntentId || !customerId || !email || !plan || !billing) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const planKey = plan.toLowerCase()
  const VALID_INTERVALS = ['monthly', 'quarterly', 'semi_annual', 'annual']
  const billingKey = VALID_INTERVALS.includes(billing) ? billing : 'monthly'
  const priceId = PRICE_MAP[planKey]?.[billingKey]

  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan or billing period' })
  }

  try {
    // 1. Verify SetupIntent succeeded
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (setupIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Card authentication failed. Please try again.' })
    }

    if (setupIntent.customer !== customerId) {
      return res.status(400).json({ error: 'Invalid request.' })
    }

    // 2. Idempotency: check if customer already has an active subscription
    const existingSubs = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1,
    })
    if (existingSubs.data.length > 0) {
      return res.status(200).json({
        success: true,
        redirect_url: 'https://platform.stoaix.com/login',
      })
    }

    // 3. Set default payment method on customer
    const paymentMethodId = setupIntent.payment_method
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    // 4. Provision subscription, user, org, etc.
    const result = await provisionSubscription({
      customerId,
      paymentMethodId,
      email,
      firstName,
      lastName,
      company,
      phone,
      password,
      planKey,
      billingKey,
      priceId,
      promoCode,
      addDedicatedSupport,
      addReactivation,
      addSetup,
      partnerRef,
      fbc,
      fbp,
      req,
    })

    return res.status(200).json(result)
  } catch (err) {
    console.error('Confirm-setup error:', err)
    return res.status(500).json({ error: err.message || 'Subscription setup failed' })
  }
}

// ── Modül satın alma (à la carte, deneme yok) — AYRI dal; free-trial akışına dokunmaz ──
async function handleModuleSubscribe(req, res) {
  const { email, firstName, lastName, company, phone, paymentMethodId, product_keys, fbc, fbp } = req.body

  if (!email || !paymentMethodId || !Array.isArray(product_keys) || product_keys.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Server-side doğrulama: yalnız katalogdaki key'ler (client feature/price GÖNDEREMEZ — server çözer)
  const invalid = product_keys.filter((k) => !MODULE_CATALOG[k])
  if (invalid.length > 0) {
    return res.status(400).json({ error: `Invalid module: ${invalid.join(', ')}` })
  }

  const priceIds = []
  const featureSet = new Set()
  const crmSet = new Set()
  for (const k of product_keys) {
    const m = MODULE_CATALOG[k]
    const priceId = process.env[m.priceEnv]
    if (!priceId) {
      return res.status(400).json({ error: `Module price not configured: ${k}` })
    }
    priceIds.push(priceId)
    m.featureKeys.forEach((f) => featureSet.add(f))
    m.crmFlags.forEach((c) => crmSet.add(c))
  }

  try {
    // Idempotency #1 (A4 — ardışık çift-submit: sayfa-yenileme / çift-sekme): aynı email'e ait AKTİF modül
    // aboneliği varsa yeni customer/subscription OLUŞTURMA → mevcut girişe yönlendir (çift-fatura/çift-org önlenir).
    const lowerEmail = email.toLowerCase()
    const existing = await stripe.customers.list({ email: lowerEmail, limit: 5 })
    for (const c of existing.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'active', limit: 20 })
      if (subs.data.some((s) => s.metadata?.self_serve_modules === '1')) {
        return res.status(200).json({ success: true, redirect_url: 'https://platform.stoaix.com/login' })
      }
    }

    const customer = await stripe.customers.create({
      email,
      name: `${firstName || ''} ${lastName || ''}`.trim() || undefined,
      phone: phone || undefined,
      metadata: { company: company || '', modules: product_keys.join(',') },
    })

    // Modül = deneme YOK → direct attach + default pm (Business deseni; 3DS PaymentIntent ile)
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id })
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    const result = await provisionModules({
      customerId: customer.id,
      email,
      firstName,
      lastName,
      company,
      phone,
      password: req.body.password,
      productKeys: product_keys,
      priceIds,
      featureKeys: Array.from(featureSet),
      crmFlags: Array.from(crmSet),
      fbc,
      fbp,
      req,
    })

    return res.status(200).json(result)
  } catch (err) {
    console.error('Module subscribe error:', err)
    return res.status(500).json({ error: err.message || 'Module subscription failed' })
  }
}

// ── Giriş paketi satın alma (yazili_resepsiyonist, deneme yok) ──
// Sıra: hesap kontrolü → customer → abonelik (ilk fatura hemen) → [3DS: istemci onaylar,
// handleEntryConfirm devam eder] → provisionEntryPackage. Org yalnız ödeme alındıktan sonra açılır.
const LOGIN_URL = 'https://platform.stoaix.com/login'
const LIVE_SUB_STATUSES = ['active', 'trialing', 'past_due', 'unpaid']

function entryFormFields(body) {
  const { email, firstName, lastName, company, phone, password, country, website, partnerRef, promoCode, fbc, fbp } = body
  return { email, firstName, lastName, company, phone, password, country, website, partnerRef, promoCode, fbc, fbp }
}

async function handleEntrySubscribe(req, res) {
  const form = entryFormFields(req.body)
  const { paymentMethodId } = req.body

  if (!form.email || !paymentMethodId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    // 1. Bu e-postanın zaten hesabı varsa ödeme ALINMAZ, girişe yönlendirilir (çift org önlenir)
    if (await findExistingOrgForEmail(form.email)) {
      return res.status(409).json({
        error: 'An account with this email already exists. Please log in.',
        redirect_url: LOGIN_URL,
      })
    }

    const priceId = await resolveEntryPriceId()
    if (!priceId) {
      console.error('Entry package price not configured (plans.stripe_price_monthly)')
      return res.status(500).json({ error: 'Plan is not available right now. Please try again later.' })
    }
    const stripePromoId = await resolvePromoId(form.promoCode)

    // 2. Customer: önceki yarım kalmış denemeden kalan (canlı aboneliği olmayan) customer yeniden kullanılır
    let customer = null
    const existingCustomers = await stripe.customers.list({ email: form.email, limit: 10 })
    for (const c of existingCustomers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 20 })
      if (subs.data.some((s) => LIVE_SUB_STATUSES.includes(s.status))) continue
      // Aynı customer'da terk edilmiş (3DS tamamlanmamış) giriş paketi aboneliği kalmasın
      for (const s of subs.data) {
        if (s.status === 'incomplete' && s.metadata?.plan_id === ENTRY_PLAN_ID) {
          await stripe.subscriptions.cancel(s.id).catch(() => {})
        }
      }
      customer = c
      break
    }
    if (!customer) {
      customer = await stripe.customers.create({
        email: form.email,
        name: `${form.firstName || ''} ${form.lastName || ''}`.trim() || undefined,
        phone: form.phone || undefined,
        metadata: { company: form.company || '', plan: ENTRY_PLAN_ID, billing: 'monthly' },
      })
    }

    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id })
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    // 3. Abonelik — plan_id metadata'sı OLUŞTURMA anında (platform webhook'u metadata'sız
    //    aboneliği 'essential' sayar). organization_id, org açılınca eklenir.
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      metadata: { plan_id: ENTRY_PLAN_ID, self_serve_entry: '1' },
      ...(stripePromoId && { promotion_code: stripePromoId }),
      expand: ['latest_invoice.payment_intent'],
    }, {
      idempotencyKey: `entrysub_${customer.id}_${paymentMethodId}`,
    })

    const paymentIntent = subscription.latest_invoice?.payment_intent
    if (paymentIntent?.status === 'requires_payment_method') {
      await stripe.subscriptions.cancel(subscription.id).catch(() => {})
      return res.status(400).json({ error: 'Payment failed. Please try a different card.' })
    }
    if (paymentIntent?.status === 'requires_action') {
      // 3DS — istemci confirmCardPayment yapar, sonra entrySubscriptionId ile handleEntryConfirm'e döner
      return res.status(200).json({
        success: true,
        requires_payment_action: true,
        payment_client_secret: paymentIntent.client_secret,
        entry_subscription_id: subscription.id,
        customer_id: customer.id,
      })
    }
    if (subscription.status !== 'active') {
      return res.status(400).json({ error: 'Payment could not be completed. Please try again.' })
    }

    const result = await provisionEntryPackage({
      ...form,
      subscription,
      customerId: customer.id,
      promoApplied: !!stripePromoId,
      req,
    })
    return res.status(200).json(result)
  } catch (err) {
    console.error('Entry subscribe error:', err)
    return res.status(500).json({ error: err.message || 'Subscription failed' })
  }
}

// ── Giriş paketi: 3DS sonrası kurulum ──
async function handleEntryConfirm(req, res) {
  const form = entryFormFields(req.body)
  const { entrySubscriptionId, customerId } = req.body

  if (!entrySubscriptionId || !customerId || !form.email) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(entrySubscriptionId, {
      expand: ['latest_invoice.payment_intent', 'customer'],
    })
    const subCustomer = subscription.customer

    if (subCustomer?.id !== customerId || subscription.metadata?.plan_id !== ENTRY_PLAN_ID) {
      return res.status(400).json({ error: 'Invalid request.' })
    }
    if ((subCustomer.email || '').toLowerCase() !== form.email.toLowerCase()) {
      return res.status(400).json({ error: 'Invalid request.' })
    }
    // İdempotent: org zaten açıldıysa (çift istek) yeniden kurma
    if (subscription.metadata?.organization_id) {
      return res.status(200).json({ success: true, redirect_url: LOGIN_URL })
    }

    const paymentIntent = subscription.latest_invoice?.payment_intent
    if (subscription.status !== 'active' && paymentIntent?.status !== 'succeeded') {
      return res.status(400).json({ error: 'Card authentication failed. Please try again.' })
    }

    if (await findExistingOrgForEmail(form.email)) {
      console.error(`ENTRY CONFIRM: paid sub ${subscription.id} but email already has an org; not provisioning — review manually`)
      return res.status(200).json({ success: true, redirect_url: LOGIN_URL })
    }

    const result = await provisionEntryPackage({
      ...form,
      subscription,
      customerId,
      promoApplied: (subscription.discounts || []).length > 0 || !!subscription.discount,
      req,
    })
    return res.status(200).json(result)
  } catch (err) {
    console.error('Entry confirm error:', err)
    return res.status(500).json({ error: err.message || 'Subscription setup failed' })
  }
}

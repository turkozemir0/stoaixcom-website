import Stripe from 'stripe'
import { provisionSubscription } from '../_lib/provision.js'

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
      // Already provisioned (e.g. duplicate confirm-setup call)
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

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { sendEvent } from '../_lib/fb-capi.js'

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

  const { email, firstName, lastName, company, plan, billing, paymentMethodId } = req.body

  if (!email || !plan || !billing || !paymentMethodId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const planKey = plan.toLowerCase()
  const billingKey = billing === 'annual' ? 'annual' : 'monthly'
  const priceId = PRICE_MAP[planKey]?.[billingKey]

  const PLAN_PRICES = {
    essential:    { monthly: 79, annual: 63 },
    professional: { monthly: 149, annual: 119 },
    business:     { monthly: 299, annual: 239 },
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
      metadata: { company: company || '', plan: planKey, billing: billingKey },
    })

    // 2. Attach payment method
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customer.id })
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })

    // 3. Create subscription with 7-day trial
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      trial_period_days: 7,
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    })

    // 4. Create Supabase user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: req.body.password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        company,
        plan: planKey,
        billing: billingKey,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscription.id,
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })

    if (authError) {
      if (!authError.message?.includes('already')) {
        return res.status(400).json({ error: authError.message })
      }
    }

    const userId = authData?.user?.id
    if (!userId) {
      return res.status(500).json({ error: 'User creation failed' })
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

    // 6. Mark lead as converted + FB CAPI Purchase event
    await supabase
      .from('signup_leads')
      .update({ converted: true, converted_at: new Date().toISOString() })
      .eq('email', email.toLowerCase())

    sendEvent({
      eventName: 'Purchase',
      email,
      firstName,
      lastName,
      value: price,
      sourceUrl: 'https://stoaix.com/checkout',
    }).catch(() => {})

    // 7. Generate magic link → platform.stoaix.com/auth/callback → onboarding
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: 'https://platform.stoaix.com/onboarding',
      },
    })

    if (linkError || !linkData?.properties?.action_link) {
      return res.status(200).json({
        success: true,
        redirect_url: 'https://platform.stoaix.com/login',
      })
    }

    return res.status(200).json({
      success: true,
      redirect_url: linkData.properties.action_link,
    })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: err.message || 'Subscription failed' })
  }
}

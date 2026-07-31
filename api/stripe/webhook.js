import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Read raw body from request stream (no micro dependency needed)
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PARTNER_API = 'https://partner.stoaix.com/api/webhook'

const PLAN_PRICES = {
  essential:    { monthly: 79, annual: 63 },
  professional: { monthly: 149, annual: 119 },
  business:     { monthly: 299, annual: 239 },
}

// Disable body parsing — Stripe needs raw body for signature verification
export const config = {
  api: { bodyParser: false },
}

async function forwardToPartner(endpoint, payload) {
  try {
    const res = await fetch(`${PARTNER_API}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PARTNER_WEBHOOK_SECRET}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    console.log(`Partner ${endpoint} response:`, res.status, data)
  } catch (err) {
    console.error(`Partner ${endpoint} error:`, err.message)
  }
}

async function resolveOrgId(stripeCustomerId, subscription) {
  // Try subscription metadata first
  if (subscription?.metadata?.organization_id) {
    return {
      orgId: subscription.metadata.organization_id,
      planId: subscription.metadata.plan_id || null,
    }
  }

  // Fallback: look up org_subscriptions table
  const { data } = await supabase
    .from('org_subscriptions')
    .select('organization_id, plan_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  return data
    ? { orgId: data.organization_id, planId: data.plan_id }
    : { orgId: null, planId: null }
}

function getPriceFromSubscription(subscription) {
  if (!subscription?.items?.data?.[0]) return { price: 0, interval: 'monthly' }
  const item = subscription.items.data[0]
  const unitAmount = item.price?.unit_amount || 0
  const interval = item.price?.recurring?.interval === 'year' ? 'annual' : 'monthly'
  return { price: unitAmount / 100, interval }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const rawBody = await getRawBody(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Invalid signature' })
  }

  const { type, data } = event

  try {
    switch (type) {
      case 'invoice.paid': {
        const invoice = data.object
        // Skip $0 invoices (trials)
        if (invoice.amount_paid === 0) {
          return res.json({ received: true, skipped: 'zero_amount' })
        }

        const subscription = invoice.subscription
          ? await stripe.subscriptions.retrieve(invoice.subscription)
          : null

        // Modül faturası: PLAN org_subscriptions/partner'a DOKUNMA (yeni clinic_tools org zaten active;
        // mevcut full-plan org'un plan status'unu modül ödemesi yanlışlıkla 'active' yapmasın = dunning bypass önlenir).
        if (subscription?.metadata?.self_serve_modules === '1') {
          return res.json({ received: true, skipped: 'module_invoice' })
        }

        const { orgId, planId } = await resolveOrgId(invoice.customer, subscription)
        if (!orgId) {
          return res.json({ received: true, skipped: 'no_org' })
        }

        const { price, interval } = getPriceFromSubscription(subscription)

        // Update org_subscriptions status
        await supabase
          .from('org_subscriptions')
          .update({ status: 'active' })
          .eq('organization_id', orgId)

        await forwardToPartner('payment', {
          organization_id: orgId,
          stripe_invoice_id: invoice.id,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          period_start: invoice.period_start
            ? new Date(invoice.period_start * 1000).toISOString()
            : null,
          period_end: invoice.period_end
            ? new Date(invoice.period_end * 1000).toISOString()
            : null,
          plan_type: planId,
          monthly_price: price,
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = data.object
        const subscription = invoice.subscription
          ? await stripe.subscriptions.retrieve(invoice.subscription)
          : null

        // Modül aboneliği ödeme başarısızı PLAN 'churned' bildirimini tetiklememeli (modül ≠ plan).
        if (subscription?.metadata?.self_serve_modules === '1') break

        const { orgId } = await resolveOrgId(invoice.customer, subscription)
        if (!orgId) break

        await forwardToPartner('status', {
          organization_id: orgId,
          status: 'churned',
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object
        const { orgId } = await resolveOrgId(subscription.customer, subscription)
        if (!orgId) break

        // À la carte MODÜL aboneliği iptali: yalnız ilgili modül erişimini kapat; PLAN org_subscriptions'a DOKUNMA.
        // (Aksi halde mevcut full-plan org'a eklenmiş modülün iptali, o müşterinin PLAN sub'ını cancelled yapardı = erişim kaybı.)
        if (subscription.metadata?.self_serve_modules === '1') {
          const featureKeys = (subscription.metadata.feature_keys || '').split(',').filter(Boolean)
          const crmFlags = (subscription.metadata.crm_flags || '').split(',').filter(Boolean)
          for (const fk of featureKeys) {
            await supabase
              .from('org_entitlement_overrides')
              .update({ enabled: false })
              .eq('organization_id', orgId)
              .eq('feature_key', fk)
          }
          if (crmFlags.length > 0) {
            const { data: orgRow } = await supabase.from('organizations').select('crm_config').eq('id', orgId).single()
            const crm = (orgRow?.crm_config && typeof orgRow.crm_config === 'object') ? { ...orgRow.crm_config } : {}
            for (const flag of crmFlags) {
              if (crm[flag]) crm[flag] = { ...crm[flag], enabled: false }
            }
            await supabase.from('organizations').update({ crm_config: crm }).eq('id', orgId)
          }
          break
        }

        // Normal PLAN aboneliği iptali (mevcut davranış)
        await supabase
          .from('org_subscriptions')
          .update({ status: 'cancelled' })
          .eq('organization_id', orgId)

        await forwardToPartner('status', {
          organization_id: orgId,
          status: 'cancelled',
        })
        break
      }

      case 'customer.subscription.updated': {
        const subscription = data.object
        // À la carte modül aboneliği güncellemesi PLAN org_subscriptions'a DOKUNMAMALI (modül ≠ plan).
        if (subscription.metadata?.self_serve_modules === '1') break
        const { orgId } = await resolveOrgId(subscription.customer, subscription)
        if (!orgId) break

        const { price, interval } = getPriceFromSubscription(subscription)

        // Detect plan change by checking items
        const priceId = subscription.items?.data?.[0]?.price?.id
        let newPlanId = subscription.metadata?.plan_id || null

        // Try to resolve plan name from price
        if (!newPlanId && priceId) {
          for (const [plan, prices] of Object.entries(PLAN_PRICES)) {
            if (price === prices.monthly || price === prices.annual) {
              newPlanId = plan
              break
            }
          }
        }

        if (newPlanId && price > 0) {
          // Update org_subscriptions
          await supabase
            .from('org_subscriptions')
            .update({
              plan_id: newPlanId,
              billing_interval: interval,
              status: subscription.status === 'active' ? 'active' : subscription.status,
            })
            .eq('organization_id', orgId)

          await forwardToPartner('plan-change', {
            organization_id: orgId,
            plan_type: newPlanId,
            monthly_price: price,
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${type}`)
    }
  } catch (err) {
    console.error(`Error handling ${type}:`, err)
    // Return 200 to prevent Stripe retries for processing errors
    return res.status(200).json({ received: true, error: err.message })
  }

  return res.json({ received: true })
}

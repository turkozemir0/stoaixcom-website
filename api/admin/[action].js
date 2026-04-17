const { getClient } = require('../_lib/supabase')
const { requireAdmin } = require('../_lib/auth')
const { setCorsHeaders, handleOptions, sendError, sendJson } = require('../_lib/cors')

const VALID_STATUSES = ['pending', 'approved', 'paid']

module.exports = async function handler(req, res) {
  setCorsHeaders(res)
  if (handleOptions(req, res)) return

  try {
    requireAdmin(req)
  } catch (err) {
    return sendError(res, err.status || 401, err.message)
  }

  const supabase = getClient()
  const { action } = req.query

  if (action === 'affiliates') {
    return handleAffiliates(req, res, supabase)
  }
  if (action === 'commissions') {
    return handleCommissions(req, res, supabase)
  }

  return sendError(res, 404, 'Not found')
}

async function handleAffiliates(req, res, supabase) {
  if (req.method !== 'GET') return sendError(res, 405, 'Method not allowed')

  try {
    const { data: affiliates, error } = await supabase
      .from('affiliates')
      .select(`
        id, slug, name, email, plan, tier, status, created_at,
        affiliate_referrals ( id, converted_at, customer_id ),
        affiliate_commissions ( id, amount, status, period_month )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin affiliates error:', error)
      return sendError(res, 500, 'Failed to fetch affiliates')
    }

    const enriched = affiliates.map(a => ({
      ...a,
      totalReferrals: (a.affiliate_referrals || []).length,
      activeClients: (a.affiliate_referrals || []).filter(r => r.converted_at).length,
      totalCommissions: (a.affiliate_commissions || [])
        .reduce((sum, c) => sum + parseFloat(c.amount), 0)
        .toFixed(2),
      pendingCommissions: (a.affiliate_commissions || [])
        .filter(c => c.status === 'pending')
        .reduce((sum, c) => sum + parseFloat(c.amount), 0)
        .toFixed(2),
    }))

    return sendJson(res, { affiliates: enriched })
  } catch (err) {
    console.error('Admin affiliates error:', err)
    return sendError(res, 500, 'Internal server error')
  }
}

async function handleCommissions(req, res, supabase) {
  if (req.method === 'GET') {
    const statusFilter = req.query.status

    let query = supabase
      .from('affiliate_commissions')
      .select(`
        id, amount, commission_rate, status, period_month, created_at,
        affiliates ( id, name, email, slug )
      `)
      .order('created_at', { ascending: false })

    if (statusFilter && VALID_STATUSES.includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query
    if (error) return sendError(res, 500, 'Failed to fetch commissions')
    return sendJson(res, { commissions: data })
  }

  if (req.method === 'PATCH') {
    const { id } = req.query
    const { status } = req.body || {}

    if (!id) return sendError(res, 400, 'Commission id required')
    if (!VALID_STATUSES.includes(status)) return sendError(res, 400, 'Invalid status')

    const { data, error } = await supabase
      .from('affiliate_commissions')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) return sendError(res, 500, 'Failed to update commission')
    return sendJson(res, { commission: data })
  }

  return sendError(res, 405, 'Method not allowed')
}

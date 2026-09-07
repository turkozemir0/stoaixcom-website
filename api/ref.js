const { getClient } = require('./_lib/supabase')
const { setCorsHeaders } = require('./_lib/cors')

// 45 days — must match cookie-policy.html and the client-side writers
// in index.html / signup.html, which all write the same partner_ref cookie
const COOKIE_MAX_AGE = 60 * 60 * 24 * 45

module.exports = async function handler(req, res) {
  setCorsHeaders(res)

  // Extract slug from the rewritten path: /ref/:slug → query string via vercel rewrite
  const slug = req.query.slug || (req.url.split('/ref/')[1] || '').split('?')[0]

  if (!slug) {
    return res.redirect(302, '/')
  }

  try {
    const supabase = getClient()
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, slug')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()

    if (affiliate) {
      // Track the click
      const visitorIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || ''
      await supabase.from('affiliate_referrals').insert({
        affiliate_id: affiliate.id,
        visitor_ip: visitorIp.split(',')[0].trim(),
      })

      // partner_ref is read by checkout.html and signup.html, and is also written
      // from ?ref= by index.html and signup.html. Keep the name, and COOKIE_MAX_AGE
      // above, in sync across all of them and with cookie-policy.html.
      // Use the value from the database, not the raw request path.
      res.setHeader(
        'Set-Cookie',
        `partner_ref=${encodeURIComponent(affiliate.slug)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax; Secure`
      )
    }
  } catch (err) {
    console.error('Ref tracking error:', err)
  }

  const redirectTo = req.query.to || '/'
  return res.redirect(302, redirectTo)
}

import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
    return res.status(204).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))

  const { email, recaptchaToken, firstName, lastName, company, plan, billing, fbc, fbp } = req.body

  if (!email || !recaptchaToken) {
    return res.status(400).json({ error: 'Missing email or reCAPTCHA token' })
  }

  // 1. Verify reCAPTCHA v3
  try {
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    })
    const recaptchaData = await recaptchaRes.json()

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(403).json({ error: 'reCAPTCHA verification failed. Please try again.' })
    }
  } catch (err) {
    console.error('reCAPTCHA error:', err)
    return res.status(500).json({ error: 'reCAPTCHA verification error' })
  }

  // 2. Generate 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 min TTL

  try {
    // 3. Delete old codes for this email
    await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email.toLowerCase())

    // 4. Insert new code
    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert({
        email: email.toLowerCase(),
        code,
        expires_at: expiresAt,
        verified: false,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return res.status(500).json({ error: 'Failed to save verification code' })
    }

    // 5. Upsert signup lead
    await supabase
      .from('signup_leads')
      .upsert({
        email: email.toLowerCase(),
        first_name: firstName || null,
        last_name: lastName || null,
        company: company || null,
        plan: plan || null,
        billing: billing || null,
      }, { onConflict: 'email' })

    // 6. Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'STOAIX <noreply@stoaix.com>',
      to: email,
      subject: 'Your STOAIX verification code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="https://stoaix.com/assets/logo-iconwithname.svg" alt="STOAIX" height="32" />
          </div>
          <h1 style="font-size: 22px; font-weight: 700; color: #1e293b; text-align: center; margin-bottom: 8px;">
            Verify your email
          </h1>
          <p style="font-size: 15px; color: #64748b; text-align: center; margin-bottom: 32px; line-height: 1.5;">
            Enter this code to continue creating your STOAIX account.
          </p>
          <div style="background: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1e293b;">${code}</span>
          </div>
          <p style="font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.5;">
            This code expires in 5 minutes.<br />
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return res.status(500).json({ error: 'Failed to send verification email' })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('send-otp error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

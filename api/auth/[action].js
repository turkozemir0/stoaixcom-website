import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { sendEvent, getClientIp, getUserAgent } from '../_lib/fb-capi.js'

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

function setCors(res) {
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v))
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    setCors(res)
    return res.status(204).end()
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  setCors(res)

  const { action } = req.query

  switch (action) {
    case 'send-otp':        return handleSendOtp(req, res)
    case 'verify-otp':      return handleVerifyOtp(req, res)
    case 'login':           return handleLogin(req, res)
    case 'forgot-password': return handleForgotPassword(req, res)
    default:                return res.status(404).json({ error: 'Not found' })
  }
}

// ── send-otp ──────────────────────────────────────────────
async function handleSendOtp(req, res) {
  const { email, recaptchaToken, firstName, lastName, company, plan, billing } = req.body

  if (!email || !recaptchaToken) {
    return res.status(400).json({ error: 'Missing email or reCAPTCHA token' })
  }

  // Verify reCAPTCHA v3
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

  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString()

  try {
    await supabase
      .from('email_verifications')
      .delete()
      .eq('email', email.toLowerCase())

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

// ── verify-otp ────────────────────────────────────────────
async function handleVerifyOtp(req, res) {
  const { email, code, password, fbc, fbp } = req.body

  if (!email || !code) {
    return res.status(400).json({ error: 'Missing email or code' })
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .single()

    if (error || !data) {
      return res.status(400).json({ error: 'Invalid verification code' })
    }

    if (new Date(data.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Code has expired. Please request a new one.' })
    }

    if (data.verified) {
      return res.status(200).json({ success: true })
    }

    const { error: updateError } = await supabase
      .from('email_verifications')
      .update({ verified: true })
      .eq('id', data.id)

    if (updateError) {
      console.error('Update error:', updateError)
      return res.status(500).json({ error: 'Failed to verify code' })
    }

    const { data: leadData } = await supabase
      .from('signup_leads')
      .update({ email_verified: true, verified_at: new Date().toISOString() })
      .eq('email', email.toLowerCase())
      .select('first_name, last_name, plan, company')
      .single()

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        first_name: leadData?.first_name,
        last_name: leadData?.last_name,
        company: leadData?.company,
        plan: leadData?.plan,
      },
    })

    let userId = authData?.user?.id

    if (authError) {
      if (authError.message?.includes('already')) {
        const { data: linkData } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: email.toLowerCase(),
        })
        userId = linkData?.user?.id
      } else {
        console.error('User creation error:', authError)
        return res.status(500).json({ error: 'Failed to create account' })
      }
    }

    if (userId) {
      await supabase
        .from('signup_leads')
        .update({ user_id: userId })
        .eq('email', email.toLowerCase())
    }

    sendEvent({
      eventName: 'Lead',
      email: email.toLowerCase(),
      firstName: leadData?.first_name,
      lastName: leadData?.last_name,
      value: 10,
      sourceUrl: 'https://stoaix.com/signup',
      clientIp: getClientIp(req),
      clientUserAgent: getUserAgent(req),
      fbc,
      fbp,
      contentName: leadData?.plan ? `${leadData.plan} Plan` : undefined,
      contentCategory: 'subscription',
    }).catch(() => {})

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('verify-otp error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── login ─────────────────────────────────────────────────
async function handleLogin(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (authError) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const { data: lead } = await supabase
      .from('signup_leads')
      .select('converted, first_name, last_name, company, plan, billing')
      .eq('email', email.toLowerCase())
      .single()

    if (lead?.converted) {
      const { data: linkData } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: email.toLowerCase(),
        options: {
          redirectTo: 'https://platform.stoaix.com/auth/callback?next=/dashboard',
        },
      })

      return res.status(200).json({
        success: true,
        converted: true,
        redirect_url: linkData?.properties?.action_link || 'https://platform.stoaix.com/login',
      })
    }

    return res.status(200).json({
      success: true,
      converted: false,
      signup_data: {
        firstName: lead?.first_name || '',
        lastName: lead?.last_name || '',
        company: lead?.company || '',
        plan: lead?.plan || 'business',
        billing: lead?.billing || 'monthly',
        email: email.toLowerCase(),
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

// ── forgot-password ───────────────────────────────────────
async function handleForgotPassword(req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  try {
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email.toLowerCase(),
      options: {
        redirectTo: 'https://stoaix.com/reset-password',
      },
    })

    if (!linkError && linkData?.properties?.action_link) {
      await resend.emails.send({
        from: 'STOAIX <no-reply@stoaix.com>',
        to: email.toLowerCase(),
        subject: 'Reset your STOAIX password',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <img src="https://stoaix.com/assets/logo-iconwithname.svg" alt="STOAIX" style="height: 28px; margin-bottom: 32px;" />
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 12px;">Reset your password</h2>
            <p style="font-size: 0.9rem; color: #64748b; line-height: 1.6; margin-bottom: 24px;">
              We received a request to reset your password. Click the button below to set a new one. This link expires in 1 hour.
            </p>
            <a href="${linkData.properties.action_link}" style="display: inline-block; padding: 12px 28px; background: #2563eb; color: #fff; font-size: 0.9rem; font-weight: 600; text-decoration: none; border-radius: 8px;">
              Reset password
            </a>
            <p style="font-size: 0.8rem; color: #94a3b8; margin-top: 32px; line-height: 1.5;">
              If you didn't request this, you can safely ignore this email. Your password won't be changed.
            </p>
          </div>
        `,
      })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Forgot password error:', err)
    return res.status(200).json({ success: true })
  }
}

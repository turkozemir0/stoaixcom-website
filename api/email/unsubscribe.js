import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SECRET = process.env.UNSUBSCRIBE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY

function generateToken(email) {
  return createHmac('sha256', SECRET).update(email.toLowerCase()).digest('hex')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, token } = req.query

  if (!email || !token) {
    return res.status(400).send(htmlPage('Geçersiz İstek', 'Eksik parametre.'))
  }

  const expectedToken = generateToken(email)
  if (token !== expectedToken) {
    return res.status(403).send(htmlPage('Geçersiz Bağlantı', 'Bu abonelikten çıkma bağlantısı geçersiz.'))
  }

  try {
    const { error } = await supabase
      .from('signup_leads')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('email', email.toLowerCase())

    if (error) {
      console.error('Unsubscribe DB error:', error)
      return res.status(500).send(htmlPage('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.'))
    }

    return res.status(200).send(htmlPage(
      'Abonelikten Çıkıldı',
      'E-posta adresiniz başarıyla abonelikten çıkarıldı. Artık STOAIX\'ten hatırlatma e-postaları almayacaksınız.'
    ))
  } catch (err) {
    console.error('Unsubscribe error:', err)
    return res.status(500).send(htmlPage('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.'))
  }
}

function htmlPage(title, message) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — STOAIX</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f8ff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .card { background: #fff; border-radius: 16px; padding: 48px 32px; max-width: 440px; text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .card img { height: 32px; margin-bottom: 24px; }
    .card h1 { font-size: 22px; color: #0c1427; margin-bottom: 12px; }
    .card p { font-size: 15px; color: #4a5a78; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <img src="https://stoaix.com/assets/logo-iconwithname.svg" alt="STOAIX" />
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`
}

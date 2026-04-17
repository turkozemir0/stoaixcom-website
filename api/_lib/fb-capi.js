import { createHash } from 'crypto'

const PIXEL_ID = '1426016022664547'
const API_VERSION = 'v21.0'

function sha256(value) {
  if (!value) return undefined
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

export async function sendEvent({ eventName, email, firstName, lastName, value, currency = 'USD', sourceUrl, eventId }) {
  const accessToken = process.env.FB_ACCESS_TOKEN
  if (!accessToken) {
    console.warn('FB_ACCESS_TOKEN not set, skipping CAPI event:', eventName)
    return
  }

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId || `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      action_source: 'website',
      event_source_url: sourceUrl || 'https://stoaix.com/signup',
      user_data: {
        em: email ? [sha256(email)] : undefined,
        fn: firstName ? [sha256(firstName)] : undefined,
        ln: lastName ? [sha256(lastName)] : undefined,
      },
      custom_data: {
        value: value || 0,
        currency,
      },
    }],
    access_token: accessToken,
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json()
    if (!res.ok) {
      console.error('FB CAPI error:', data)
    }
    return data
  } catch (err) {
    console.error('FB CAPI fetch error:', err)
  }
}

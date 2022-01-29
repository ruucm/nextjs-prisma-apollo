import { loadStripe } from '@stripe/stripe-js'

export const toDateTime = (secs) => {
  const t = new Date('1970-01-01T00:30:00Z') // Unix epoch start.
  t.setSeconds(secs)
  return t
}

export const postData = async ({ url, token, data = {} }) => {
  const res: any = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  })

  if (res.error) {
    throw Error
  }

  return res.json()
}

//--------Strip payments------------
let stripePromise
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE ??
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    )
  }
  return stripePromise
}

export const getURL = () => {
  const url =
    process?.env?.URL && process.env.URL !== ''
      ? process.env.URL
      : process?.env?.VERCEL_URL && process.env.VERCEL_URL !== ''
      ? process.env.VERCEL_URL
      : process.env.BASE_URL
  return url.includes('http') ? url : `https://${url}`
}

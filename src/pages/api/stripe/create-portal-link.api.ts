import { getURL } from '@/utils'
import { createOrRetrieveCustomer, stripe } from './shared'
// import { getUser } from '@/utils/supabase-admin';
// import { createOrRetrieveCustomer } from '@/utils/useDatabase';
import { getSession } from 'next-auth/client'

const createPortalLink = async (req, res) => {
  if (req.method === 'POST') {
    // const token = req.headers.token;
    const session = await getSession({ req })
    const user = session.user

    try {
      // const user = await getUser(token);
      const customer = await createOrRetrieveCustomer({
        // @ts-ignore
        userId: user.userId,
        email: user.email,
      })

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/account`,
      })

      return res.status(200).json({ url })
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default createPortalLink

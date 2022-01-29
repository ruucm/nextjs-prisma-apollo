import { getURL } from '@/utils'
import { createOrRetrieveCustomer, stripe } from './shared'
import { getSession } from 'next-auth/client'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })
    const user = session.user

    const { price, quantity = 1, metadata = {} } = req.body

    console.log('user', user)
    console.log('price', price)

    try {
      const customer = await createOrRetrieveCustomer({
        // @ts-ignore
        userId: user.userId,
        email: user.email,
      })

      console.log('customer', customer)

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        customer,
        line_items: [
          {
            price,
            quantity,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        subscription_data: {
          trial_from_plan: true,
          metadata,
        },
        success_url: `${getURL()}/account`,
        cancel_url: `${getURL()}/pricing`,
      })

      return res.status(200).json({ sessionId: session.id })
    } catch (err) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default handler

import { useUser } from '@/hooks/useUser'
import prisma from '@/lib/prisma'
import { getStripe, postData } from '@/utils'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { PricingCard } from './PricingCard'
import superjson from 'superjson'

type Props = {
  productsString: ''
}

const PricingPage: React.FC<Props> = ({ productsString }) => {
  const products = superjson.parse<Array<any>>(productsString) || []

  const { session, userLoaded } = useUser()
  const router = useRouter()

  const { subscription } = useUser()

  const [billingInterval, setBillingInterval] = useState('month')

  const handleCheckout = async (price) => {
    // setPriceIdLoading(price.id)
    if (!session) {
      return router.push('/auth/signin')
    }
    if (subscription) {
      return router.push('/account')
    }

    try {
      const { sessionId } = await postData({
        url: '/api/stripe/create-checkout-session',
        data: { price },
        token: session.accessToken,
      })

      const stripe = await getStripe()
      stripe.redirectToCheckout({ sessionId })
    } catch (error) {
      console.log('error', error)
      return alert(error.message)
    } finally {
      // setPriceIdLoading(false)
    }
  }
  if (!products.length) return <div>No Products</div>

  return (
    <div className="flex-row gap-4">
      <PricingCard
        product={{ name: 'Hobby', description: 'Completely Free' }}
        onClick={() => alert('navigate to sign in page')}
        buttonLabel="Start"
      />
      {products.map((product) => {
        const price = product.prices?.find(
          (price) => price.interval === billingInterval
        )
        const priceString = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: price.currency,
          minimumFractionDigits: 0,
        }).format(price.unit_amount / BigInt(100))

        return (
          <PricingCard
            key={product.id}
            product={product}
            priceString={priceString}
            billingInterval={billingInterval}
            onClick={() => handleCheckout(price.id)}
            buttonLabel={
              product.name === subscription?.prices?.products.name
                ? 'Manage'
                : 'Subscribe'
            }
          />
        )
      })}
    </div>
  )
}

export default PricingPage

export async function getStaticProps() {
  const products = await prisma.products.findMany({
    select: {
      id: true,
      name: true,
      prices: true,
    },
  })

  return {
    props: {
      productsString: superjson.stringify(products), // use superjson cause unit_amount type is "bigint"
    },
    revalidate: 60,
  }
}

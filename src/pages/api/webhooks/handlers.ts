import Stripe from 'stripe'
import prisma from '@/lib/prisma'
import { toDateTime } from '@/utils'

const stripeSecret =
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY

export const stripe = new Stripe(stripeSecret, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
})

export const upsertProductRecord = async (product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  }

  await prisma.products.upsert({
    where: {
      id: product.id,
    },
    update: productData,
    create: productData,
  })

  console.log(`Product inserted/updated: ${product.id}`)
}

export const upsertPriceRecord = async (price) => {
  const priceData = {
    id: price.id,
    product_id: price.product,
    active: price.active,
    currency: price.currency,
    description: price.nickname,
    type: price.type,
    unit_amount: price.unit_amount,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  }

  await prisma.prices.upsert({
    where: {
      id: price.id,
    },
    update: priceData,
    create: priceData,
  })
  console.log(`Price inserted/updated: ${price.id}`)
}

export const createOrRetrieveCustomer = async ({ email, userId }) => {
  const data = await prisma.customers.findUnique({
    where: {
      id: userId,
    },
    select: {
      stripe_customer_id: true,
    },
  })

  if (data) return data.stripe_customer_id
  else {
    // No customer record found, let's create one.
    const customerData: any = {
      metadata: {
        prismaUUID: userId,
      },
    }
    if (email) customerData.email = email
    const customer = await stripe.customers.create(customerData)
    // Now insert the customer ID into DB.
    await prisma.customers.create({
      data: { id: userId, stripe_customer_id: customer.id },
    })

    console.log(`New customer created and inserted for ${userId}.`)
    return customer.id
  }
}

export const manageSubscriptionStatusChange = async (
  subscriptionId,
  customerId,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const customer = await prisma.customers.findUnique({
    where: { stripe_customer_id: customerId },
    select: { id: true },
  })

  const userId = customer.id

  console.log('userId', userId)

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  })

  // Upsert the latest status of the subscription object.
  const subscriptionData = {
    id: subscription.id,
    user_id: userId,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : null,
    current_period_start: toDateTime(subscription.current_period_start),
    current_period_end: toDateTime(subscription.current_period_end),
    created: toDateTime(subscription.created),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : null,
  }

  await prisma.subscriptions.upsert({
    where: {
      id: subscription.id,
    },
    update: subscriptionData,
    create: subscriptionData,
  })

  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${userId}]`
  )

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  // if (createAction && subscription.default_payment_method)
  //   await copyBillingDetailsToCustomer(
  //     uuid,
  //     subscription.default_payment_method
  //   );
}

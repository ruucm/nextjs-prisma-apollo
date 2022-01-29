import { objectType } from 'nexus'
import { users, subscriptions, products, prices, customers } from 'nexus-prisma'
import prisma from '@/lib/prisma'

//--------Auth------------

export const usersT = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: users.$name,
  // name: 'users',
  definition(t) {
    t.field(users.id)
    t.field(users.email)
    t.field(users.full_name)
    t.field(users.avatar_url)
    t.field(users.emailVerified)
    t.field(users.posts)
  },
})

//--------CRUD------------

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.string('title')
    t.nullable.string('content')
    t.boolean('published')
    t.nullable.field('users', {
      type: 'users',
      resolve: (parent) =>
        prisma.post
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .users(),
    })
  },
})

//--------Subscription------------

export const subscriptionsT = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: subscriptions.$name,
  definition(t) {
    t.field(subscriptions.id)
    t.field(subscriptions.user_id)
    t.field(subscriptions.status)
    t.field(subscriptions.metadata)
    t.field(subscriptions.price_id)
    t.field(subscriptions.quantity)
    t.field(subscriptions.cancel_at_period_end)
    t.field(subscriptions.created)
    t.field(subscriptions.current_period_end)
    t.field(subscriptions.current_period_end)
    t.field(subscriptions.ended_at)
    t.field(subscriptions.cancel_at)
    t.field(subscriptions.canceled_at)
    t.field(subscriptions.trial_start)
    t.field(subscriptions.trial_start)
    t.field(subscriptions.users)
    t.field({
      ...subscriptions.prices,
      resolve(parent, _, __, ___) {
        // To use default resolver (https://nexus.prisma.io/recipes#project-relation-with-custom-resolver-logic)
        // await subscriptions.prices.resolve(parent, _, __, ___)

        return prisma.prices.findUnique({
          where: { id: parent.price_id },
        })
      },
    })
  },
})

export const productsT = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: products.$name,
  definition(t) {
    t.field(products.id)
    t.field(products.active)
    t.field(products.name)
    t.field(products.description)
    t.field(products.image)
    t.field(products.metadata)
    t.field(products.prices)
  },
})

export const pricesT = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: prices.$name,
  definition(t) {
    t.field(prices.id)
    t.field(prices.product_id)
    t.field(prices.active)
    t.field(prices.description)
    t.field(prices.unit_amount)
    t.field(prices.description)
    t.field(prices.currency)
    t.field(prices.type)
    t.field(prices.interval)
    t.field(prices.interval_count)
    t.field(prices.trial_period_days)
    t.field(prices.metadata)
    t.field(prices.subscriptions)
    t.field({
      ...prices.products,
      resolve: (parent) =>
        prisma.products.findUnique({
          where: { id: parent.product_id },
        }),
    })
  },
})

export const customersT = objectType({
  nonNullDefaults: {
    output: true,
    input: false,
  },
  name: customers.$name,
  definition(t) {
    t.field(customers.id)
    t.field(customers.stripe_customer_id)
    t.field(customers.users)
  },
})

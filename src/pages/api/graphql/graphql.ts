import { ApolloServer } from 'apollo-server-micro'
import { GraphQLScalarType } from 'graphql'
import {
  BigIntResolver,
  DateTimeResolver,
  JSONObjectResolver,
} from 'graphql-scalars'
import cors from 'micro-cors'
import { NextApiHandler } from 'next'
import { asNexusMethod, enumType, makeSchema } from 'nexus'
import path from 'path'
import { GRAPHQL_API_BASE } from '@/consts'
import { getSession } from 'next-auth/client'
import { Mutation } from './mutation'
import { Query } from './query'
import {
  Post,
  usersT,
  subscriptionsT,
  productsT,
  pricesT,
  customersT,
} from './types'
import {
  pricing_plan_interval,
  pricing_type,
  subscription_status,
} from 'nexus-prisma'

const jsonScalar = new GraphQLScalarType({
  ...JSONObjectResolver,
  // Override the default 'JsonObject' name with one that matches what Nexus Prisma expects.
  name: 'Json',
})
const dateTimeScalar = new GraphQLScalarType(DateTimeResolver)
const bigIntScalar = new GraphQLScalarType(BigIntResolver)

const Void = new GraphQLScalarType({
  name: 'Void',
  description: 'Represents NULL values',
  serialize() {
    return null
  },
  parseValue() {
    return null
  },
  parseLiteral() {
    return null
  },
})

export const schema = makeSchema({
  types: [
    asNexusMethod(jsonScalar, 'json'),
    asNexusMethod(dateTimeScalar, 'dateTime'),
    asNexusMethod(bigIntScalar, 'bigint'),
    asNexusMethod(Void, 'void'),

    // enumTypes
    enumType(subscription_status),
    enumType(pricing_type),
    enumType(pricing_plan_interval),

    // objectTypes
    Post,
    usersT,
    subscriptionsT,
    productsT,
    pricesT,
    customersT,

    // queryTypes
    Query,
    Mutation,
  ],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const session = await getSession({ req })
    return { req, session }
  },
})

let apolloServerHandler: NextApiHandler

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    await apolloServer.start()

    apolloServerHandler = apolloServer.createHandler({
      path: GRAPHQL_API_BASE,
    })
  }

  return apolloServerHandler
}

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === 'OPTIONS') {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}

export default cors()(handler)

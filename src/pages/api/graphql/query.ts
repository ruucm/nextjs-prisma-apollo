import { nonNull, nullable, queryType, stringArg } from 'nexus'
import prisma from '@/lib/prisma'

export const Query = queryType({
  definition(t) {
    //--------CRUD------------

    t.field('Post', {
      type: 'Post',
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.post.findUnique({
          where: { id: Number(args.postId) },
        })
      },
    })
    t.list.field('Posts', {
      type: 'Post',
      resolve(_, __, ctx) {
        return prisma.post.findMany({
          where: { published: true },
        })
      },
    })
    t.list.field('Drafts', {
      type: 'Post',
      resolve(_, __, { session }) {
        if (!session) throw new Error('Unauthorized')

        return prisma.post.findMany({
          where: {
            users: { email: session.user.email },
            published: false,
          },
        })
      },
    })

    //--------Subscription------------

    t.list.field('subscriptionBy', {
      type: 'subscriptions',
      args: { userId: nonNull(stringArg()) },
      resolve: (_, args, ctx) =>
        prisma.subscriptions.findMany({
          where: {
            users: { id: args.userId },
            OR: [{ status: 'trialing' }, { status: 'active' }],
          },
          include: {
            prices: true, // Returns price fields defined in types.ts (nexus)
          },
          orderBy: {
            created: 'desc',
          },
        }),
    })
  },
})

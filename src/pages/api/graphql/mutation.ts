import prisma from '@/lib/prisma'
import { intArg, objectType, stringArg } from 'nexus'

export const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    // GraphQL Demo
    t.nullable.field('createPost', {
      type: 'Post',
      args: {
        title: stringArg(),
        content: stringArg(),
      },
      resolve: async (_, { title, content }, { session }) => {
        if (!session) throw new Error('Unauthorized')

        return prisma.post.create({
          data: {
            title,
            content,
            users: { connect: { email: session.user.email } },
          },
        })
      },
    })
    t.nullable.field('publishPost', {
      type: 'Post',
      args: { postId: intArg() },
      resolve: (_, { postId }, { session }) => {
        console.log('postId', postId)
        if (!session) throw new Error('Unauthorized')

        return prisma.post.update({
          where: { id: postId },
          data: { published: true },
        })
      },
    })
    t.nullable.field('deletePost', {
      type: 'Post',
      args: { postId: intArg() },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.delete({
          where: { id: postId },
        })
      },
    })
  },
})

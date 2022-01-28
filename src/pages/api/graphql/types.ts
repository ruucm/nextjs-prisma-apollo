import { objectType } from 'nexus'
import { users } from 'nexus-prisma'
import prisma from '@/lib/prisma'

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

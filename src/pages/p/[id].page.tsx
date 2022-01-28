import React from 'react'
import { GetServerSideProps } from 'next'
import ReactMarkdown from 'react-markdown'
import Layout from '../../components/Layout'
import Router from 'next/router'
import { PostProps } from '../../components/Post'
import prisma from '../../lib/prisma'
import { useUser } from '@/hooks/useUser'
import { useMutation } from '@apollo/client'
import { gql } from 'graphql-tag'

const Post: React.FC<PostProps> = (props) => {
  const { session, loading, refetch } = useUser()
  const [publishPost] = useMutation(PublishMutation)
  const [deletePost] = useMutation(DeleteMutation)

  if (loading) {
    return <div>Authenticating ...</div>
  }
  const userHasValidSession = Boolean(session)
  const postBelongsToUser = session?.user?.email === props.users?.email
  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.users?.full_name || 'Unknown author'}</p>
        {/* @ts-ignore */}
        <ReactMarkdown source={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button
            onClick={async () => {
              await publishPost({ variables: { postId: props.id } })
              refetch() // update drafts (useUser)
              await Router.push('/')
            }}
          >
            Publish
          </button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button
            onClick={async () => {
              await deletePost({ variables: { postId: props.id } })
              refetch() // update drafts (useUser)
              await Router.push('/')
            }}
          >
            Delete
          </button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Post

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      users: {
        select: { full_name: true, email: true },
      },
    },
  })
  return {
    props: post,
  }
}

const PublishMutation = gql`
  mutation PublishPost($postId: Int) {
    publishPost(postId: $postId) {
      id
    }
  }
`

const DeleteMutation = gql`
  mutation DeletePost($postId: Int) {
    deletePost(postId: $postId) {
      id
    }
  }
`

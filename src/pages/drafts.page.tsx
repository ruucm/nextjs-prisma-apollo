import React, { useEffect } from 'react'
import Post, { PostProps } from '../components/Post'
import { useUser } from '@/hooks/useUser'

type Props = {
  drafts: PostProps[]
}

const Drafts: React.FC<Props> = (props) => {
  const { session, Drafts, refetch } = useUser()

  useEffect(() => {
    refetch()
  }, [])

  if (!session) {
    return (
      <>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </>
    )
  }

  return (
    <>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {Drafts?.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </>
  )
}

export default Drafts

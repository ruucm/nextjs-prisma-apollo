import React, { useState } from 'react'
import Router from 'next/router'
import { gql } from 'graphql-tag'
import { useMutation } from '@apollo/client'

const Create: React.FC = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [createPost, { data, loading, error }] = useMutation(Mutation)

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await createPost({ variables: { title, content } })
      await Router.push('/drafts')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div>
        <form onSubmit={submitData}>
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </>
  )
}

export default Create

const Mutation = gql`
  mutation Mutation($title: String, $content: String) {
    createPost(title: $title, content: $content) {
      id
    }
  }
`

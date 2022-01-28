import { useQuery } from '@apollo/client'
import { gql } from 'graphql-tag'
import { useSession } from 'next-auth/client'
import { useEffect, useState, createContext, useContext } from 'react'

export const UserContext = createContext(null)

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(null)

  const [session, sessionLoading] = useSession()
  const { loading, data, refetch } = useQuery(Query, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all', // get relation using gql emits weird error, this error policy gives data even if it has the error.
  })

  useEffect(() => {
    setUser(session?.user ?? null)
  }, [session])

  const value = {
    session,
    user,
    userLoaded: !sessionLoading,
    dataLoaded: !loading,
    refetch,

    Drafts: data?.Drafts,
  }
  return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`)
  }
  return context
}

const Query = gql`
  query Query {
    Drafts {
      id
      title
      users {
        full_name
      }
    }
  }
`

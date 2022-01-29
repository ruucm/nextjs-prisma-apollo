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
    variables: { userId: user?.userId ?? '' },
    errorPolicy: 'all', // get relation using gql emits weird error, this error policy gives data even if it has the error.
  })

  useEffect(() => {
    setUser(session?.user ?? null)
  }, [session])

  const value = {
    session,
    user,
    sessionLoading,
    dbLoading: loading,
    refetch,

    Drafts: data?.Drafts,
    subscription: data?.subscriptionBy[0], // return single value. (latest one)
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
  query Query($userId: String!) {
    Drafts {
      id
      title
      users {
        full_name
      }
    }

    subscriptionBy(userId: $userId) {
      id
      metadata
      status
      price_id
      quantity
      cancel_at_period_end
      created
      current_period_end
      ended_at
      cancel_at
      canceled_at
      trial_start
      prices {
        products {
          name
        }
      }
    }
  }
`

import { GRAPHQL_API_BASE } from '@/consts'
import { ApolloClient, InMemoryCache } from '@apollo/client'

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${process.env.BASE_URL}/${GRAPHQL_API_BASE}`,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

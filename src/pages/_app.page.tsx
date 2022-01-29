import { Provider as SessionProvider } from 'next-auth/client'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '@/helpers'
import { UserContextProvider } from '@/hooks/useUser'
import Layout from '@/components/Layout'
import '@/styles/main.css'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <UserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserContextProvider>
      </ApolloProvider>
    </SessionProvider>
  )
}

export default App

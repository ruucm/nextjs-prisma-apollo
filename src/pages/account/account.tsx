import { useUser } from '@/hooks/useUser'
import { postData } from '@/utils'
import { signOut } from 'next-auth/client'
import Router from 'next/router'
import React from 'react'

type Props = {}

const AccountPage: React.FC<Props> = (props) => {
  const { session, subscription, dbLoading } = useUser()

  const redirectToCustomerPortal = async () => {
    // setLoading(true);
    const { url, error } = await postData({
      url: '/api/stripe/create-portal-link',
      token: session.accessToken,
    })
    if (error) return alert(error.message)
    window.location.assign(url)
    // setLoading(false);
  }

  return (
    <div className="items-start">
      <button
        onClick={() => {
          signOut()
          Router.push('/')
        }}
      >
        Sign out
      </button>
      <br />
      <br />
      {dbLoading && 'Loading DB...'}
      {subscription && (
        <>
          <p>Manage your subscription on Stripe.</p>
          <button onClick={redirectToCustomerPortal}>
            Open customer portal
          </button>
        </>
      )}
      <br />
      <br />
      {JSON.stringify(subscription?.[0], null, 4)}
    </div>
  )
}

export default AccountPage

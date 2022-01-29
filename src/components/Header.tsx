import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/client'
import styles from './Header.module.scss'

const Header: React.FC = () => {
  const router = useRouter()
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname

  const [session, loading] = useSession()

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link href="/">
          <a data-active={isActive('/')}>Feed</a>
        </Link>
        <Link href="/pricing">
          <a data-active={isActive('/pricing')}>Pricing</a>
        </Link>
      </div>
      <div className={styles.right}>
        {loading ? (
          <p>Validating session ...</p>
        ) : (
          <>
            {!session && (
              <Link href="/auth/signin">
                <a data-active={isActive('/signup')}>Log in</a>
              </Link>
            )}
            {session && (
              <>
                <Link href="/account">
                  <a data-active={isActive('/account')}>
                    {session.user.name} ({session.user.email})
                  </a>
                </Link>
                <Link href="/create">
                  <button>
                    <a>New post</a>
                  </button>
                </Link>
                <button onClick={() => signOut()}>
                  <a>Log out</a>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  )
}

export default Header

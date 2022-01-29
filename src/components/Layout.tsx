import React, { ReactNode } from 'react'
import Header from './Header'
import styles from './Layout.module.scss'

type Props = {
  children: ReactNode
}

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className={styles.layout}>{props.children}</div>
  </div>
)

export default Layout

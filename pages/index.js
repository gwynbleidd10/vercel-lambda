import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Link href="/sc">
        <a>Ситуационный центр МКС</a>
      </Link>
      <Link href="/esed">
        <a>Отчёты в ESED</a>
      </Link>
    </div>
  )
}

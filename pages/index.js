
import styles from '../styles/Home.module.css'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router';
import Link from 'next/link'

export default function Home() {

  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>...</p>
  }

  return (
    <div className={styles.container}>
      {session && (
        <p> You are logged in as {' '} {session.user.email}{' '}
        <br/>
        <button
          className="underline"
          onClick={() => {
            signOut()
            router.push('/')
          }}
        >
        logout
        </button>
        </p>
      )}
      { !session && 
        <p>You are not logged in 😞.  
          <br/>
          <Link href='/api/auth/signin'><a>Login</a></Link>
        </p> }
     </div>
  )
}

import { useEffect } from 'react'

export default function Layout({ children, ...rest }) {
  console.log('remote2', rest)
  useEffect(() => {
    console.log('remote2 mount')
    return () => {
      console.log('remote2 unmount')
    }
  }, [])
  return <div>{children}</div>
}

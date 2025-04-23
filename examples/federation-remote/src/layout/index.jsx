import { useEffect } from 'react'
// import { Test } from 'remoteTest/components'

export default function Layout({ children, ...rest }) {
  useEffect(() => {
    console.log('remote mount')
    return () => {
      console.log('remote unmount')
    }
  }, [])
  return (
    <div>
      <div>remote layout</div>
      {children}
    </div>
  )
}

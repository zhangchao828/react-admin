import { useAppContext } from '@zswl/admin'
import { useEffect } from 'react'

export default function Layout({ children }) {
  const { setAppData, data } = useAppContext()
  useEffect(() => {
    setTimeout(() => {
      setAppData({ access: '*', name: 'aa' })
    }, 2000)
  }, [])
  console.log('host appdata', data)
  console.log('host layout')
  return (
    <div>
      host layout
      <div>{children}</div>
    </div>
  )
}

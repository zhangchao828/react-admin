import { useAppContext } from '@zswl/admin'
import { useEffect, useState } from 'react'

export default function Layout({ children }) {
  const { setAppData, data } = useAppContext()
  const [count, setCount] = useState(0)
  // useEffect(() => {
  //   setTimeout(() => {
  //     setAppData({ access: '*', name: 'aa' })
  //   }, 2000)
  // }, [setAppData])
  // console.log('host appdata', data)
  // console.log('host layout')
  return children
}

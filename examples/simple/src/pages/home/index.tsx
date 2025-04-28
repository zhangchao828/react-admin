import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState<number>(0)
  function add() {
    setCount(count + 1)
  }
  return <div onClick={add}>{count}</div>
}

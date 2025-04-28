import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState<number>(0)
  return <div>{count}</div>
}

import { useState, useEffect } from 'react'

export default function Home() {
  const [num, setNum] = useState(0)
  console.log('render', num)
  useEffect(() => {
    setInterval(() => {
      setNum(1)
    }, 1000)
  }, [])
  return <Child />
}

function Child() {
  console.log('child')
  return <div>child</div>
}

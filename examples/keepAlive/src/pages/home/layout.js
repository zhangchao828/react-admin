import { observer, useActive } from '@glcc/admin'
import { useEffect } from 'react'

function Index({ children }) {
  console.log('render home/layout')
  useEffect(() => {
    console.log('mount home/layout')
  }, [])
  return (
    <div>
      <div>home/layout</div>
      {children}
    </div>
  )
}

export default observer(Index)

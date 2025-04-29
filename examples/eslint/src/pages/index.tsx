import { PageProps } from '@glcc/admin'
import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

const Index: React.FC<PageProps> = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log(count)
  }, [])
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  console.log(obj)
  const a = async () => {}
  console.log(a)
  const b = (p) => {
    console.log(p)
  }
  console.log(b)
  const c: number = 100
  switch (c) {
    case 1:
      console.log(1)
      break
    case 2:
      console.log(2)
      break
  }
  return (
    <div key="aaaa" onClick={() => setCount(count + 1)}>
      {count}
      <Table
        columns={[
          {
            title: 'title',
            render() {
              return <Cell>xxxxx</Cell>
            },
          },
        ]}
      />
    </div>
  )
}
const Cell = (props) => {
  return <div {...props}></div>
}
// object-shorthand
export function objectShorthand() {
  const z = 'z'
  const y = 'y'
  const ok = {
    x: () => {},
    w() {},
    [y]() {},
    z,
  }
  // const error = {
  //   w: function () {},
  //   [y]: function () {},
  //   z: z,
  // }
  console.log(ok)
}

export class A {
  obj = {}
}
export default Index

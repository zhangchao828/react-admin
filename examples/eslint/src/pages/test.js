import { useState } from 'react'
import { Table } from 'antd'

const Cell = ({ planned, disabled, ...rest }) => {
  // 这里可以根据数据渲染不同样式
  return <td {...rest} style={{ background: planned ? '#25ce56' : '#fff' }}></td>
}

const mockData = [
  { id: 1, name: 'aaa' },
  { id: 2, name: 'bbb', planned: true, disabled: true },
]
const Index = () => {
  return (
    <div>
      <Table
        rowKey="id"
        components={{
          body: {
            cell: Cell,
          },
        }}
        dataSource={mockData}
        columns={[
          {
            title: '实施助理',
            dataIndex: 'name',
            render: (text) => {
              return <div>{text}</div>
            },
          },
          {
            title: '4月1号 周三',
            key: '4-1',
            onCell(record) {
              const { planned, disabled } = record
              return {
                planned,
                disabled,
              }
            },
            render: (record) => {
              return 'aaa'
            },
          },
        ]}
      />
    </div>
  )
}

export default Index

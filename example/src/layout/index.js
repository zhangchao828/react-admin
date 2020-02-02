import React from 'react'
import { App, Sidebar } from '../../../components'

export default ({ children }) => (
  <App
    header="header"
    logo="logo"
    isLogin={() => true}
    footer="aaa"
    sidebar={
      <Sidebar
        config={[
          {
            title: '主页',
            icon: 'home',
            page: 'index'
          },
          {
            title: '工具',
            icon: 'tool',
            children: [
              {
                title: '项目管理',
                page: 'project'
              }
            ]
          }
        ]}
      />
    }
  >
    {children}
  </App>
)

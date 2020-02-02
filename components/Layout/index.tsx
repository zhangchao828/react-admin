import React, { ReactNode } from 'react'
import styles from './style.less'
import { Layout } from 'antd'

const { Header, Sider, Content, Footer } = Layout
export interface LayoutProps {
  header?: ReactNode
  sidebar?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  logo?: ReactNode
  sidebarProps?: object
}
export default function(props: LayoutProps) {
  const { logo, header, sidebar, children, footer, sidebarProps } = props
  const siderProps = {
    width: 220,
    ...sidebarProps
  }
  return (
    <Layout className={styles.admin_layout}>
      <Sider className={styles.layout_sidebar} {...siderProps}>
        <div className={styles.layout_logo}>{logo}</div>
        <div className={styles.layout_menu}>{sidebar}</div>
      </Sider>
      <Layout className={styles.layout_wrap} style={{ marginLeft: siderProps.width }}>
        {header && <Header className={styles.layout_header}>{header}</Header>}
        <Content className={styles.layout_content}>{children}</Content>
        {footer && <Footer className={styles.layout_footer}>{footer}</Footer>}
      </Layout>
    </Layout>
  )
}

import React, { ReactNode } from 'react'
import { Breadcrumb } from 'antd'
import styles from './style.less'
import cls from 'classnames'

const { Item } = Breadcrumb
interface IProps {
  children: ReactNode
  header?: string | Array<ReactNode>
  className?: string
}

export default function(props: IProps) {
  const { children, header, className } = props
  let headerCom = null
  if (header) {
    headerCom =
      typeof header === 'string' ? (
        header
      ) : (
        <Breadcrumb>
          {header.map((item, index) => (
            <Item key={index}>{item}</Item>
          ))}
        </Breadcrumb>
      )
  }
  return (
    <div className={styles.page_wrap}>
      <div className={styles.header}>{headerCom}</div>
      <div className={cls(styles.content, className)}>{children}</div>
    </div>
  )
}

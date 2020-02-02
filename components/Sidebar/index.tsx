/* eslint-disable */
import React from 'react'
import { Menu, Icon } from 'antd'
import AppContext from '../AppContext'

const { SubMenu, Item } = Menu

interface IProps {
  config: object[]
  control?: (item: object) => boolean
}
export default class extends React.PureComponent<IProps> {
  static defaultProps = {
    config: [],
    control: () => true
  }

  static contextType = AppContext

  clickMenuItem = item => () => {
    const { onClick, page } = item
    const { activePage, history } = this.context
    if (onClick) {
      onClick(item)
    } else if (page && page !== activePage) {
      history.push(`/${page}`)
    }
  }

  getOpenKeys = (tree, path = []) => {
    const { activePage } = this.context
    if (!tree) return []
    for (const item of tree) {
      path.push(item.__key__)
      if (activePage === item.page) return path
      if (Array.isArray(item.children)) {
        const findChildren = this.getOpenKeys(item.children, path)
        if (findChildren.length) return findChildren
      }
      path.pop()
    }
    return []
  }

  allKeys = []

  getMenuTree = config => {
    const { control } = this.props
    return config.map(item => {
      const { page, title, icon, children } = item || {}
      // 没有权限
      if (control(item) === false) {
        return null
      }
      const key = page || title
      item.__key__ = key
      if (key) {
        if (this.allKeys.includes(key)) {
          console.error(`侧边栏config中page或title字段必须唯一：${key}`)
          return null
        }
        this.allKeys.push(key)
      }
      if (Array.isArray(children)) {
        return (
          <SubMenu
            key={key}
            title={
              <span>
                {icon && <Icon type={icon} />}
                <span>{title}</span>
              </span>
            }
          >
            {this.getMenuTree(children)}
          </SubMenu>
        )
      }
      return (
        <Item key={key} onClick={this.clickMenuItem(item)}>
          {icon && <Icon type={icon} />}
          <span>{title}</span>
        </Item>
      )
    })
  }

  render() {
    this.allKeys = []
    const { config, control, ...rest } = this.props
    const { activePage } = this.context
    const menuTree = this.getMenuTree(config)
    const openKeys = this.getOpenKeys(config)
    return (
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[activePage]}
        defaultOpenKeys={openKeys}
        {...rest}
      >
        {menuTree}
      </Menu>
    )
  }
}

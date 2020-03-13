## react-admin 用来快速简单的创建 react 应用

## 安装

```shell script
npm install react-admin-core react-hot-loader

# react-hot-loader 是为了热更新需要（在没有更好的方式前先用这个）
```

## 基本使用

- 1.创建工程

新建一个最简单的工程，目录结构如下所示

```
|-- project
 |-- index.html
 |-- package.json
 |-- src
     |-- pages
         |-- demo
             |-- index.js
```

pages/demo/index.js 中添加如下代码

```jsx harmony
export default () => '页面demo'
```

- 2.在 package.json 中添加命令

```json
{
  "scripts": {
    "start": "react-admin start",
    "build": "react-admin build"
  }
}
```

- 3.启动工程

```shell script
npm run start
```

- 4.访问 demo 页面

访问http://localhost:3000/#/demo 就会显示 pages/demo/index 的内容

## 入口文件

整个工程的入口文件没有被暴露出来，被内置在 react-admin 中，但是也可以自定义入口文件

- 在 src 目录下新建 index.js 作为入口文件

```
|-- project
  |-- src
      |-- index.js
```

index.js 中的代码如下

```jsx harmony
import React from 'react'
import { HashRouter } from 'react-router-dom'

/**
 * 整个应用的入口文件，在这里可以设置一些初始化的配置、样式等
 * 比如配置BrowserRouter还是HashRouter(必须二选一，默认是HashRouter)
 * 比如配置第三方库的 Provider
 * children必须在BrowserRouter或HashRouter内部
 */
export default function({ children }) {
  return <HashRouter>{children}</HashRouter>
}
```

## 全局布局 layout

当你需要对整个应用做全局布局时可以自定义全局布局

- 在 src 目录下新建 layout/index.js 作为布局入口

```
|-- project
  |-- src
      |-- layout
          |-- index.js
```

layout/index.js 中的代码如下

```jsx harmony
import React from 'react'

export default function(props) {
  /**
   * children表示当前渲染的页面内容，对应于pages目录下的页面内容
   * activePage表示当前渲染的页面名称，即pages目录下的文件夹名称
   * 当访问路由/demo时，activePage就是demo，对应的页面是/pages/demo
   * 当访问根路由/时，activePage是index，对应的页面是/pages/index
   */
  const { children, activePage } = props
  if (activePage === 'login') {
    return children
  }
  return (
    <div>
      <header>header</header>
      <main>{children}</main>
      <footer>footer</footer>
    </div>
  )
}
```

## 嵌套路由

react-admin 只会根据 pages 目录下的第一级目录自动生成对应路由，即：

- 访问/ 对应 /pages/index
- 访问/demo 对应 /pages/demo
- 访问/demo/test 还是对应 /pages/demo

如果要设置嵌套路由，比如/demo/test，那么只需要修改/pages/demo/index.js 的代码如下

```jsx harmony
// pages/demo/index.js
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import Test from './Test'

export default function() {
  return (
    <Switch>
      <Route exact path="/demo" component={Home} />
      <Route path="/demo/test" component={Test} />
    </Switch>
  )
}
```

## css 预处理器

- css 预处理器目前只支持 less

## cssModules

整个工程中所有的 css 都被 cssModules 化了，如果不需要 cssModules，那么可以添加:global

```less
:global {
  .wrap {
    color: #f00;
  }
}
```

## typescript

默认支持 tsx，直接创建/pages/demo/index.tsx 即可

## 工程的全局配置

为了更加灵活的配置工程，可以自定义配置文件 admin.config.js

```javascript
module.exports = {
  port: 3000,
  // 是否启用eslint
  eslint: true,
  // http代理，参考http-proxy-middleware
  proxy: {},
  // webpack的output.publicPath
  publicPath: './',
  // webpack的resolve.alias设置别名
  alias: {},
  // webpack的externals配置
  externals: {
    react: {
      name: 'React',
      cdn: '//unpkg.com/react@16.12.0/umd/react.production.min.js'
    },
    'react-dom': {
      name: 'ReactDOM',
      cdn: '//unpkg.com/react-dom@16.12.0/umd/react-dom.production.min.js'
    },
    'react-router-dom': {
      name: 'ReactRouterDOM',
      cdn: '//unpkg.com/react-router-dom@5.1.2/umd/react-router-dom.min.js'
    }
  }
}
```

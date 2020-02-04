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

* 3.启动工程

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

  ```jsx
  import React from 'react'
  import { HashRouter } from 'react-router-dom'

  /**
   * 整个应用的入口文件，在这里可以设置一些初始化的配置、样式等
   * 比如配置BrowserRouter还是HashRouter(必须二选一)
   * 比如配置第三方库的 Provider
   * children必须在BrowserRouter或HashRouter内部
   */
  export default function({ children }) {
    return <HashRouter>{children}</HashRouter>
  }
  ```

## 布局layout


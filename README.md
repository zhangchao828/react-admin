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

访问http://localhost:3000/demo就会显示pages/demo/index的内容

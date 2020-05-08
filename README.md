## react-admin 用来快速简单的创建 react 应用

## 安装

```shell script
npm install react-admin-core core-js
```

## 基本使用

- 1.在 package.json 中添加命令

```json
{
  "scripts": {
    "start": "react-admin start",
    "build": "react-admin build"
  }
}
```

- 2.启动工程

```shell script
npm run start
```

- 3.访问页面

访问http://localhost:3000 就会显示 pages/index 页面

- 4.创建新页面

在pages目录下新建页面 example/index.js 
访问http://localhost:3000/#/example 就会显示 pages/example 页面

- 5.路由模式
默认是HashRouter，可以在/src/index.js中修改为BrowserRouter

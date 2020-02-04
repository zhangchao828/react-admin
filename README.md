## 安装

```shell script
npm install react-admin-core react-hot-loader
# react-hot-loader 是为了热更新需要（在没有更好的方式前先用这个）
```

## 使用

- 1.创建工程

  新建一个工程，目录必须按照如下所示

  ```
  |-- project
      |-- package.json
      |-- src
          |-- pages
              |-- demo
                  |-- index.js

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

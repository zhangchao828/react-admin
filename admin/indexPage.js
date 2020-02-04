import React from 'react'

/**
 * 该组件是当pages/index页面不存在的时候默认渲染的页面
 * @returns {*}
 */
export default function() {
  return (
    <>
      <style>
        {`
.container {
  font-size: 20px;
  text-align: center;
  padding: 20px;
}
.container>a {
  display: block;
  color: #0080ff;
  text-decoration: underline;
}
          `}
      </style>
      <div className="container">
        <a
          href="https://github.com/zhangchao828/react-admin"
          target="_blank"
          rel="noopener noreferrer"
        >
          react-admin
        </a>
      </div>
    </>
  )
}

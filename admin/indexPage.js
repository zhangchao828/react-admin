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
.container>img {
  margin-top: 15px;
}
          `}
      </style>
      <div className="container">
        <a
          href="http://git.hljnbw.cn/WEB_GROUP/hlj-core/src/branch/master"
          target="_blank"
          rel="noopener noreferrer"
        >
          开发前请仔细阅读婚礼纪前端脚手架使用说明
        </a>
        <img src="//qnm.hunliji.com/o_1crog4tkt1pfs15bn3j51elh7839.png" alt="react-m" />
      </div>
    </>
  )
}

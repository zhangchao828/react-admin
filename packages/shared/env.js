const { getConfig } = require('./project')
const isDev = process.env.NODE_ENV === 'development'
const env = process.env.admin_env
const command = process.env.admin_command
const extra = process.env.admin_extra

const { publicPath, base } = getConfig()
const data = JSON.parse(extra)
module.exports = {
  isDev,
  env,
  command,
  admin: data.admin,
  define: {
    __ENV__: JSON.stringify(env), // 环境
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // 信息
    __DATA__: {
      ...Object.keys(data).reduce((previousValue, currentValue) => {
        return {
          ...previousValue,
          [currentValue]: JSON.stringify(data[currentValue]),
        }
      }, {}),
      time: Date.now(), // 时间字段
      publicPath: JSON.stringify(publicPath),
      base: JSON.stringify(base),
    },
  },
}

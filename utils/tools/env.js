const lodash = require('lodash')

function getProcessArgv(name) {
  const argv = process.argv
  const obj = {}
  argv.forEach(arg => {
    if (arg.indexOf('=') > -1) {
      const [key, value] = arg.split('=')
      obj[key] = value
    }
  })
  return name ? obj[name] : obj
}
function setEnv() {
  const { ENV, PAGE, ...rest } = getProcessArgv()
  process.env.HLJ_ENV = ENV || 'dev'
  process.env.HLJ_PAGE = PAGE || ''
  process.env.HLJ_EXT = lodash.isEmpty(rest) ? '' : JSON.stringify(rest)
}
function getEnv(key) {
  const { HLJ_ENV, HLJ_PAGE, HLJ_EXT } = process.env
  const envObj = {
    ENV: HLJ_ENV || 'dev',
    PAGE: HLJ_PAGE,
    EXT: HLJ_EXT || '{}'
  }
  return key ? envObj[key] : envObj
}
function getEXT(key) {
  const EXTStr = getEnv('EXT')
  let extObj = {}
  try {
    extObj = JSON.parse(EXTStr)
  } catch (e) {
    extObj = {}
  }
  return key ? extObj[key] : extObj
}
function isBuildMode() {
  return process.env.NODE_ENV  === 'production'
}
module.exports = {
  setEnv,
  getEnv,
  getEXT,
  isBuildMode
}

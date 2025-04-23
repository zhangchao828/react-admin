const shell = require('shelljs')
const ora = require('ora')
const { TEMPLATE } = require('@glcc/shared/constant')
const message = require('@glcc/shared/message')
const fs = require('fs-extra')
const path = require('path')

module.exports = function initProject() {
  const cwd = process.cwd()
  const generateSpinner = ora('正在初始化... ')
  try {
    generateSpinner.start()
    const templatePath = path.join(cwd, '.admin-template')
    shell.exec(`git clone -b master ${TEMPLATE} ${templatePath}`, { silent: true })
    fs.removeSync(path.join(templatePath, '.git'))
    fs.copySync(templatePath, cwd, { overwrite: true })
    generateSpinner.stop()
    fs.removeSync(templatePath)
    message.success('初始化成功,执行以下命令,安装依赖,启动项目')
    message.info('$ npm install or yarn install')
    message.info('$ npm start or yarn start')
  } catch (e) {
    generateSpinner.stop()
    message.error(e)
  }
}

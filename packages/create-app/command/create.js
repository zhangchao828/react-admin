const { prompt } = require('enquirer')
const { join } = require('path')
const ora = require('ora')
const message = require('@glcc/shared/message')
const { TEMPLATE } = require('@glcc/shared/constant')
const shell = require('shelljs')
const setPkgJson = require('../utils/setPkgJson')
const fs = require('fs-extra')
const path = require('path')

module.exports = async function () {
  let projectName = process.argv[3] || ''
  if (!projectName.trim()) {
    const { name } = await prompt({
      type: 'input',
      message: '请输入你想创建的工程名称:',
      name: 'name',
      required: true,
    })
    projectName = name
  }
  const cwd = process.cwd()
  const projectPath = join(cwd, projectName)
  const generateSpinner = ora('正在创建... ')
  try {
    message.info(`开始创建 '${projectName}' 工程,请稍等...`)
    generateSpinner.start()
    shell.exec(`git clone -b master ${TEMPLATE} ${projectName}`)
    // shell.rm('-rf', join(projectPath, '.git'))
    fs.removeSync(path.join(projectPath, '.git'))
    // shell.exec('git init')
    setPkgJson(projectName)
    generateSpinner.stop()
    message.success('创建成功,执行以下命令,安装依赖,启动项目')
    message.info(`$ cd ${projectName}`)
    message.info('$ npm install or yarn install')
    message.info('$ npm start or yarn start')
  } catch (e) {
    generateSpinner.stop()
    message.error(e)
  }
}

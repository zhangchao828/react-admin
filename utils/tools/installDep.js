const { shellSync, shell } = require('execa')
const { __root } = require('./getPath')

function hasYarn() {
  try {
    shellSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    shell('npm install yarn -g')
    return false
  }
}

// 安装依赖
module.exports = async function installDep(projectPath) {
  projectPath = projectPath || __root
  const _hasYarn = hasYarn()
  if (_hasYarn) {
    await shell('yarn config set registry http://pub.hunliji.com:8019')
  }
  try {
    await shell(`cd ${projectPath} && ${_hasYarn ? 'yarn' : 'npm i'}`)
  } catch (e) {
    await shell(`cd ${projectPath} && npm i`)
  }
}

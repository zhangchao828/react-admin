const {
  vueServerNpmName,
  reactServerNpmName,
  reactMNpmName,
  reactAdminNpmName
} = require('./constant')
const { __packageJson } = require('./getPath')
module.exports = function getProjectType() {
  const { dependencies = {}, devDependencies = {} } = require(__packageJson)
  if (dependencies[vueServerNpmName] || devDependencies[vueServerNpmName]) {
    return 'vue-server'
  }
  if (dependencies[reactServerNpmName] || devDependencies[reactServerNpmName]) {
    return 'react-server'
  }
  if (dependencies[reactMNpmName] || devDependencies[reactMNpmName]) {
    return 'react-m'
  }
  if (dependencies[reactAdminNpmName] || devDependencies[reactAdminNpmName]) {
    return 'react-admin'
  }
  return null
}

const shell = require('shelljs')
const { prompt } = require('enquirer')
const rootPackageJson = require('../package.json')
const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')

/**
 * 本来是用lerna发布的，由于一些原因改为yarn
 */
async function publish() {
  const { version, registry } = await prompt([
    {
      type: 'select',
      message: '发布环境:',
      name: 'registry',
      required: true,
      choices: [{ name: 'https://registry.npmjs.org/', message: 'npm' }],
    },
    {
      type: 'input',
      message: '新版本:',
      name: 'version',
      initial: rootPackageJson.version,
      required: true,
    },
  ])
  const packages = glob
    .sync('*', {
      cwd: path.join(__dirname, '../packages'),
    })
    .reduce((previousValue, currentValue) => {
      const packagePath = path.join(__dirname, `../packages/${currentValue}`)
      const packageJsonPath = path.join(__dirname, `../packages/${currentValue}/package.json`)
      const packageJson = require(packageJsonPath)
      return {
        ...previousValue,
        [packageJson.name]: {
          packagePath,
          packageJsonPath: path.join(__dirname, '../packages', currentValue, 'package.json'),
          packageJson,
        },
      }
    }, {})
  Object.keys(packages).forEach((key) => {
    const { packageJson, packageJsonPath } = packages[key]
    packageJson.version = version
    const dep = packageJson.dependencies
    Object.keys(dep).forEach((name) => {
      if (packages[name]) {
        dep[name] = version
      }
    })
    fs.outputFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  })
  Object.keys(packages).forEach((key) => {
    const { packagePath } = packages[key]
    shell.exec(`cd ${packagePath} && yarn publish --new-version ${version}  --registry=${registry}`)
  })
  rootPackageJson.version = version
  fs.outputFileSync(
    path.join(__dirname, '../package.json'),
    JSON.stringify(rootPackageJson, null, 2)
  )
}
publish()

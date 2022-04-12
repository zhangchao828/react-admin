const fs = require('fs-extra')
const { getConfig } = require('@zc/shared/project')
const { __routes, __remotes } = require('@zc/shared/paths')
const { ModuleFederationPlugin } = require('webpack').container
const { federation } = getConfig().webpack

const { name, remotes, shared } = federation
class FederationPlugin {
  apply(compiler) {
    if (name || remotes) {
      const remoteConfig = {}
      const remoteList = []
      if (remotes) {
        remotes.forEach((item) => {
          const { name, publicPath } = item
          remoteList.push(`'${name}': () => import('${name}/app')`)
          remoteConfig[name] = `
          promise new Promise(resolve => {
            const remoteUrl = '${publicPath}remoteEntry.js?now='+Date.now()
            const script = document.createElement('script')
            script.src = remoteUrl
            script.onload = () => {
              const proxy = {
                get: (request) => {
                  return window.${name}.get(request)
                },
                init: (arg) => {
                  try {
                    return window.${name}.init(arg)
                  } catch(e) {
                    console.log(e)
                  }
                }
              }
              resolve(proxy)
            }
            document.head.appendChild(script)
          })
          `.trim()
        })
        // 将所有的微应用拼成一个对象映射，供其他地方引用，通过微应用名称找到微应用，比如内置组件Remote就会用到
        fs.outputFileSync(__remotes, `export default {${remoteList.join()}}`)
      }
      if (name) {
        /*
         设置runtimeChunk会导致ModuleFederationPlugin不工作
         https://github.com/module-federation/module-federation-examples/issues/646
         https://github.com/Guriqbal-Singh-Alida/basic-remote-runtime-single
         */
        compiler.options.optimization.runtimeChunk = false
      }
      compiler.options.plugins.push(
        new ModuleFederationPlugin({
          ...(name
            ? {
                name,
                filename: 'remoteEntry.js',
                library: { type: 'var', name },
                exposes: {
                  './app': __routes,
                },
              }
            : null),
          remotes: remoteConfig,
          shared,
        })
      )
    }
  }
}

module.exports = FederationPlugin

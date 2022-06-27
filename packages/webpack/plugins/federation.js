const fs = require('fs-extra')
const { getConfig } = require('zs-shared/project')
const { __federationApps, __federationExpose, __packageJson } = require('zs-shared/paths')
const { ModuleFederationPlugin } = require('webpack').container
const { federation } = getConfig()

const { dependencies } = require(__packageJson)
class FederationPlugin {
  apply(compiler) {
    if (federation) {
      const remoteConfig = {}
      const remoteList = []
      const shared = {
        react: {
          // singleton: true,
          eager: true,
          requiredVersion: dependencies.react || '17.0.2',
        },
        'react-dom': {
          // singleton: true,
          eager: true,
          requiredVersion: dependencies['react-dom'] || '17.0.2',
        },
      }
      if (Array.isArray(federation)) {
        federation.forEach((item) => {
          const { name, publicPath } = item
          remoteList.push(`'${name}': lazy(() => import('${name}/app'))`)
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
        compiler.options.plugins.push(
          new ModuleFederationPlugin({
            remotes: remoteConfig,
            shared,
          })
        )
        // 将所有的微应用拼成一个对象映射，供其他地方引用，通过微应用名称找到微应用，比如内置组件Remote就会用到
        fs.outputFileSync(
          __federationApps,
          `
        import { lazy } from 'react'
        export default {${remoteList.join()}}
        `
        )
      }
      if (typeof federation === 'string') {
        /*
         设置runtimeChunk会导致ModuleFederationPlugin不工作
         https://github.com/module-federation/module-federation-examples/issues/646
         https://github.com/Guriqbal-Singh-Alida/basic-remote-runtime-single
         */
        compiler.options.optimization.runtimeChunk = false
        compiler.options.plugins.push(
          new ModuleFederationPlugin({
            name: federation,
            filename: 'remoteEntry.js',
            library: { type: 'var', name: federation },
            exposes: {
              './app': __federationExpose,
            },
            shared,
          })
        )
      }
    }
  }
}

module.exports = FederationPlugin

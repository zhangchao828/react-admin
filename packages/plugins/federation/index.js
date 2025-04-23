const fs = require('fs-extra')
const { getConfig } = require('@glcc/shared/project')
const {
  __federationApps,
  __federationExpose,
  __packageJson,
  __src,
  __distFederationVersion,
  __routeModules,
  __remoteRouteModules,
  __remoteComponents,
} = require('@glcc/shared/paths')
const webpack = require('webpack')
const { ModuleFederationPlugin } = webpack.container
const { dependencies } = require(__packageJson)
const path = require('path')
const { isDev, define } = require('@glcc/shared/env')
const { RUN_TIME } = require('@glcc/shared/constant')

/**
 * 这里的逻辑很绕，不确定的情况下不要轻易修改
 */
const { federation } = getConfig()
class FederationPlugin {
  apply(compiler) {
    const shared = {
      react: {
        // singleton: true,
        eager: true,
        requiredVersion: dependencies.react || '19.0.0',
      },
      'react-dom': {
        // singleton: true,
        eager: true,
        requiredVersion: dependencies['react-dom'] || '19.0.0',
      },
    }
    if (federation.list.length) {
      const remoteConfig = {}
      const remoteList = []
      const routeModules = []
      const remoteComponents = []
      federation.list.forEach((item) => {
        const { name, entry, layout = false } = item
        routeModules.push(`()=>import('${name}/routeModules')`)
        remoteComponents.push(`'${name}':()=>import('${name}/components')`)
        remoteList.push(
          `'${name}': { 'layout':${layout},'component':lazy(()=>import('${name}/app'))}`
        )
        remoteConfig[name] = this.getEntry(name, entry)
      })
      compiler.options.plugins.push(
        new ModuleFederationPlugin({
          remotes: remoteConfig,
          shared,
        })
      )
      fs.outputFileSync(__remoteRouteModules, `export default [${routeModules.join()}]`.trim())
      fs.outputFileSync(__remoteComponents, `export default {${remoteComponents.join()}}`.trim())
      fs.outputFileSync(
        __federationApps,
        `
        import { lazy } from 'react'
        export default {${remoteList.join()}}
        `.trim()
      )
    }
    if (federation.name) {
      const { name: federationName } = federation
      if (!isDev) {
        compiler.hooks.done.tap('done', (compilation) => {
          const assets = compilation.compilation.getAssets()
          const reg = new RegExp(`${RUN_TIME}.(.*?).js`)
          const runtime = assets.find((item) => reg.test(item.name))
          if (runtime) {
            const [, hash] = runtime.name.match(reg) || []
            fs.outputFileSync(
              __distFederationVersion,
              `window.__${federationName}__VERSION__ = ${
                hash ? "'" + hash + "'" : define.__DATA__.time
              }`
            )
          }
        })
      }
      /**
       设置runtimeChunk和splitChunks会导致ModuleFederationPlugin不工作
       https://github.com/module-federation/module-federation-examples/issues/646
       https://github.com/Guriqbal-Singh-Alida/basic-remote-runtime-single
       https://github.com/webpack/webpack/issues/15738
       现在已经通过注入远程的runtime修复此bug了
       */
      // compiler.options.optimization.runtimeChunk = false // single
      // compiler.options.optimization.splitChunks = false
      const exposes = {
        './app': __federationExpose,
        './routeModules': __routeModules,
      }
      const componentsPath = path.join(__src, 'components/index.js')
      // const utilsPath = path.join(__src, 'utils/index.js')
      if (fs.pathExistsSync(componentsPath)) {
        exposes['./components'] = componentsPath
      }
      // if (fs.pathExistsSync(utilsPath)) {
      //   exposes['./utils'] = utilsPath
      // }
      compiler.options.plugins.push(
        new ModuleFederationPlugin({
          name: federationName,
          filename: 'entry.js',
          library: { type: 'var', name: federationName },
          exposes,
          shared,
        })
      )
    }
  }
  getEntry(name, entry) {
    /**
     * 这里的意思是先加载远程的federation-version.js( 远程应用打包时生成的包含runtime的hash的js文件 )
     * 然后拿到对应时间戳拼接到entry.js后面
     * 这样每当远程应用打包部署时，这个hash就会改变，从而去除缓存
     * 另外通过这个hash值加载远程的runtime,否则会出错（除非将远程子应用的runtimeChunk关闭，但是会导致打包hash的不稳定和热更新失效等问题）
     */
    const remoteDevUrl = `'${entry}entry.js'`
    const remoteProUrl = `'${entry}entry.js?version='+(window.__${name}__VERSION__ || Date.now())`
    const remoteRuntimeDevUrl = `'${entry}${RUN_TIME}.js'`
    const remoteRuntimeProUrl = `'${entry}js/${RUN_TIME}.'+window.__${name}__VERSION__+'.js'`
    return `
          promise new Promise(resolve => {
            var loadEntry = ()=> {
              var version = window.__${name}__VERSION__
              var script = document.createElement('script')
              script.src = version?${remoteProUrl}:${remoteDevUrl}
              script.onload = () => {
                const proxy = {
                  get: (request) => {
                    try {
                      return window.${name}.get(request)
                    } catch(e) {
                     console.log('federation',e)
                    } 
                  },
                  init: (arg) => {
                    try {
                      return window.${name}.init(arg)
                    } catch(e) {
                     console.log('federation',e)
                    }
                  }
               }
               resolve(proxy)
              }
              script.onerror = resolve
              document.head.appendChild(script)
            }
            var loadRuntime = ()=> {
              var version = window.__${name}__VERSION__
              var script = document.createElement('script')
              script.src = version?${remoteRuntimeProUrl}:${remoteRuntimeDevUrl}
              document.head.appendChild(script)
              script.onload = loadEntry
              script.onerror = loadEntry
            }
            var loadVersion = ()=> {
              if(window.__${name}__VERSION__){
                loadRuntime()
              }else{
                var script = document.createElement('script')
                script.src = '${entry}federation-version.js?now='+Date.now()
                document.head.appendChild(script)
                script.onload = loadRuntime
                script.onerror = loadRuntime
              }
            }
            loadVersion()
          })
          `.trim()
  }
}

module.exports = FederationPlugin

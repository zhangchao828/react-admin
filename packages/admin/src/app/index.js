import { createContext, useContext } from 'react'
import config from '~admin/config'

let APP_CONTEXT = {
  data: {},
  setAppData() {},
  // matchRoute() {},
  // removeKeepAlive() {},
  // federation: null,
  // main: {},
}
const Context = createContext({})
export const AppContext = ({ children, value }) => {
  APP_CONTEXT = value
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export function useAppContext() {
  return useContext(Context)
}

export function getAppContext() {
  return APP_CONTEXT
}
export function defineApp(App, config) {
  App.config = config || {}
  return App
}
export function matchRoute(pathname) {
  if (APP_CONTEXT.federation) {
    console.error('只有基座中才能使用 "matchRoute" 方法')
    return
  }
  return APP_CONTEXT.matchRoute(pathname)
}

export const adminConfig = config
export async function getLatestPublishData(path) {
  if (process.env.NODE_ENV === 'development') {
    return {}
  }
  try {
    let url = ''
    if (path) {
      url = path
    } else if (config.publicPath && config.publicPath !== '/') {
      url = config.publicPath
    } else {
      url = window.location.origin
    }
    const res = await window.__HTTP__.get(`${url}/data.json`, { original: true })
    return res.data || {}
  } catch {
    return {}
  }
}

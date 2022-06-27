import { createContext, useContext } from 'react'

let APP_CONTEXT = {
  meta: {},
  query: {},
  setMeta() {},
  history: {},
  pathname: '',
  params: {},
}
let MAIN_APP = {}
const Context = createContext({})
const Provider = ({ children, value }) => {
  APP_CONTEXT = value
  return <Context.Provider value={value}>{children}</Context.Provider>
}
// 内部调用，外界不要使用
export function setMainApp(app) {
  MAIN_APP = app
}
export function getMainApp() {
  return isMicroApp() ? MAIN_APP : APP_CONTEXT
}
export const AppContext = {
  Provider,
  Consumer: Context.Consumer,
}
export function useAppContext() {
  return useContext(Context)
}

export function getAppContext() {
  return APP_CONTEXT
}
export function isMicroApp() {
  return !!window.__POWERED_BY_QIANKUN__
}
export function setAppMeta(values) {
  APP_CONTEXT.setMeta(values)
}
export function getAppMeta() {
  return APP_CONTEXT.getMeta()
}
export function useAppMeta() {
  const { meta } = useAppContext()
  return meta
}
export function defineApp(App, config) {
  App.config = config || {}
  return App
}

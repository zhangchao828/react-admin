import { createContext, useContext } from 'react'

const APP_CONTEXT = 'APP_CONTEXT'

export const AppContext = createContext(undefined)
export function setAppContext(config) {
  window[APP_CONTEXT] = config || {}
}
export function getAppContext() {
  return window[APP_CONTEXT] || {}
}
export function useAppContext() {
  const ctx = useContext(AppContext)
  return ctx || getAppContext()
}

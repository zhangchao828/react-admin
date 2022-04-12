import { createContext, useContext, useEffect } from 'react'

const APP_GLOBAL = 'APP_GLOBAL_CONFIG'

const Context = createContext({})
const Provider = ({ children, value }) => {
  useEffect(() => {
    window[APP_GLOBAL] = value
  })
  return <Context.Provider value={value}>{children}</Context.Provider>
}
export const AppContext = {
  Provider,
  Consumer: Context.Consumer,
}
export function useAppContext() {
  return useContext(Context)
}

export function getAppContext() {
  return window[APP_GLOBAL] || {}
}

import { getAppContext, useAppContext } from '../appContext'
import { Redirect, BrowserRouter, HashRouter, Link, NavLink } from 'react-router-dom'

function getParams(name) {
  const { params } = getAppContext()
  return name ? params[name] : params
}

function navigate(...params) {
  getAppContext().navigate(...params)
}
function getQuery(name) {
  const { query } = getAppContext()
  return name ? query.get(name) : query
}
function useLocation() {
  return useAppContext().location
}
export {
  Redirect,
  BrowserRouter,
  HashRouter,
  Link,
  NavLink,
  navigate,
  getParams,
  getQuery,
  useLocation,
}

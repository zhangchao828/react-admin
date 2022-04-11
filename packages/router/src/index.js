import { getAppContext, useAppContext } from '@zc/admin'
import { Redirect, useLocation, BrowserRouter, HashRouter, Link, NavLink } from 'react-router-dom'

function useParams() {
  return useAppContext().params
}

function navigate(...params) {
  getAppContext().navigate(...params)
}
export { Redirect, useParams, useLocation, BrowserRouter, HashRouter, Link, NavLink, navigate }

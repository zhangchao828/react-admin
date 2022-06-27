import { getAppContext, useAppContext, isMicroApp } from '../appContext'
import { Link, useLocation, Redirect, BrowserRouter as Router, HashRouter } from 'react-router-dom'
import config from '~admin/config'

function getParams(name) {
  const { params } = getAppContext()
  return name ? params[name] : params
}
function useParams(name) {
  const { params } = useAppContext()
  return name ? params[name] : params
}
function getQuery(name) {
  let queryObj = {}
  const query = new URLSearchParams(window.location.search)
  for (const [key] of query) {
    const value = query.getAll(key)
    if (!queryObj[key]) {
      queryObj[key] = value.length > 1 ? value : value[0]
    }
  }
  return name ? queryObj[name] : queryObj
}

function BrowserRouter(props) {
  const basename = isMicroApp() ? config.microApp : '/'
  return <Router basename={basename} {...props} />
}
const history = {
  push(...arg) {
    getAppContext().history.push(...arg)
  },
  replace(...arg) {
    getAppContext().history.replace(...arg)
  },
  go(...arg) {
    getAppContext().history.go(...arg)
  },
  goBack(...arg) {
    getAppContext().history.goBack(...arg)
  },
  goForward(...arg) {
    getAppContext().history.goForward(...arg)
  },
  // listen(...arg) {
  //   getAppContext().history.listen(...arg)
  // },
}
export {
  Link,
  history,
  Redirect,
  BrowserRouter,
  HashRouter,
  getParams,
  useParams,
  getQuery,
  useLocation,
}

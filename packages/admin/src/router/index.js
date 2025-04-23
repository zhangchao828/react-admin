import { Link as RouterLink, Redirect as RouterRedirect } from 'react-router-dom'
import config from '~admin/config'
import { useMemo } from 'react'

const HISTORY = '__history__'
function getQuery(name, customSearch) {
  const queryObj = {}
  const { hash, search } = window.location
  const query = new URLSearchParams(customSearch || search || hash.substring(hash.indexOf('?')))
  for (const [key] of query) {
    const value = query.getAll(key)
    if (!queryObj[key]) {
      queryObj[key] = value.length > 1 ? value : value[0]
    }
  }
  return name ? queryObj[name] : queryObj
}
function getRealPathname(pathname) {
  const { base } = config
  if (pathname === '/') {
    return base || pathname
  }
  if (base && !pathname.startsWith(base)) {
    return base + pathname
  }
  return pathname
}
export function useRealPathname(pathname) {
  const { base } = config
  return useMemo(() => {
    const pathSplit = pathname.split('/').filter(Boolean)
    if (base && `/${pathSplit[0]}` === base) {
      return '/' + pathSplit.slice(1).join('/')
    }
    return '/' + pathSplit.join('/')
  }, [base, pathname])
}
const history = {
  push(pathname) {
    window[HISTORY].push(getRealPathname(pathname))
  },
  replace(pathname) {
    window[HISTORY].replace(getRealPathname(pathname))
  },
  goBack() {
    window[HISTORY].goBack()
  },
}
function Link({ to, ...rest }) {
  return <RouterLink to={getRealPathname(to)} {...rest} />
}
function Redirect({ to, ...rest }) {
  return <RouterRedirect to={getRealPathname(to)} {...rest}></RouterRedirect>
}
export { Link, history, Redirect, getQuery, HISTORY }

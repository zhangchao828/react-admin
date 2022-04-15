import { getAppContext, useAppContext } from '../appContext'
import { Redirect, Link, NavLink, useLocation } from 'react-router-dom'

function getParams(name) {
  const { params } = getAppContext()
  return name ? params[name] : params
}
function useParams(name) {
  const { params } = useAppContext()
  return name ? params[name] : params
}
function navigate(...params) {
  getAppContext().navigate(...params)
}
function getQuery(name) {
  const { query } = getAppContext()
  return name ? query.get(name) : query
}
export { Redirect, Link, NavLink, navigate, getParams, useParams, getQuery, useLocation }

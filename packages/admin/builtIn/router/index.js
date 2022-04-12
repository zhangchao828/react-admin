import { getAppContext, useAppContext } from '../AppContext'

function useParams() {
  return useAppContext().params
}

function navigate(...params) {
  getAppContext().navigate(...params)
}
export { navigate }
export {
  Redirect,
  useParams,
  useLocation,
  BrowserRouter,
  HashRouter,
  Link,
  NavLink,
  useHistory,
  matchPath,
} from 'react-router-dom'

interface NavigateProps {
  replace?: boolean
  state?: any
}
export declare function navigate(to: string | number, props?: NavigateProps)
export {
  Redirect,
  useLocation,
  BrowserRouter,
  HashRouter,
  Link,
  NavLink,
  useParams,
} from 'react-router-dom'

import { BrowserRouter } from 'zs-admin'
import './style.less'

export default function App({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

import { BrowserRouter } from 'react-router-dom'
import './style.less'

export default function App({ children }) {
  return <BrowserRouter basename="/demo">{children}</BrowserRouter>
}
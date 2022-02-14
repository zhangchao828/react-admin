import { BrowserRouter } from 'react-router-dom'

export default function App({ children }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

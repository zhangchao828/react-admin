import { http } from '@zswl/admin'

http.setConfig({
  baseURL: '/remote2',
})
export default function App({ children }) {
  return children
}

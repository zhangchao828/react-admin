import { http, defineApp } from '@zswl/admin'

http.setConfig({
  baseURL: '/host',
  headers: {
    name: 'host',
  },
})
function App({ children }) {
  return children
}

export default defineApp(App, {
  keepAlive: false,
})

import { defineApp, http } from '@glcc/admin'

// http.setConfig({
//   baseURL: '/remote',
// })
function App({ children }) {
  return children
}
export default defineApp(App, {
  keepAlive: false,
})

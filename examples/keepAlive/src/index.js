import { defineApp } from '@zswl/admin'

function App({ children }) {
  return children
}
//
export default defineApp(App, {
  keepAlive({ pathname }) {
    return pathname !== '/home/age'
  },
})

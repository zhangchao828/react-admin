import { defineApp, adminConfig } from '@glcc/admin'

console.log(adminConfig)
function App({ children }) {
  return children
}

console.log(__ENV__, __ENV__ === 'test', __DATA__)
console.log(
  {
    dev: 'aaaa',
    test: 'bbb',
  }[__ENV__]
)
export default defineApp(App, {
  mode: 'browser',
})

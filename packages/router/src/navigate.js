import { getAppContext } from '@zc/admin'

export default function navigate(to, props) {
  const h = getAppContext().history
  if (h) {
    if (typeof to === 'number') {
      if (to === 1) {
        return h.goForward()
      }
      if (to === -1) {
        return h.goBack
      }
      h.go(to)
    } else {
      const { replace, state } = props || {}
      if (replace) {
        h.replace(to, state)
      } else {
        h.push(to, state)
      }
    }
  }
}

import { isString } from '../is'

export default function loadScript(config) {
  const { url, globalVar } = isString(config) ? { url: config } : config || {}
  return new Promise((resolve, reject) => {
    if (!url) {
      return reject()
    }
    if (globalVar && window[globalVar]) {
      return resolve()
    }
    const node = document.querySelector(`[data-script="${url}"]`)
    if (node) {
      return resolve()
    }
    const script = document.createElement('script')
    script.onload = () => {
      script.dataset.script = url
      resolve()
    }
    script.onerror = reject
    script.src = url
    document.body.appendChild(script)
  })
}

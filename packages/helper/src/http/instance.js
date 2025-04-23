import axios from 'axios'
import requestIntercept from './request'
import responseIntercept from './response'
import { abortController } from './util'

function createInstance(config) {
  const instance = axios.create()
  instance.defaults.timeout = undefined
  instance.globalConfig = config
  instance.abort = (key) => abortController.abort(key)
  instance.getConfig = () => ({ ...config })
  requestIntercept(instance)
  responseIntercept(instance)
  return instance
}
const HTTP = '__HTTP__'
function getInstance(http) {
  if (http?.instance) {
    return http.instance
  }
  if (http?.config) {
    http.instance = createInstance(http.config)
  } else if (window[HTTP]) {
    http.instance = window[HTTP]
  }
  if (!window[HTTP]) {
    window[HTTP] = http.instance || (http.instance = createInstance())
    // window[HTTP].axios = axios
  }
  return http.instance
}
export default getInstance

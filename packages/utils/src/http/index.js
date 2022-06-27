import axios from 'axios'
import requestIntercept from './request'
import responseIntercept from './response'
import { abortController } from './util'

const http = axios.create()
requestIntercept(http)
responseIntercept(http)

http.defaults.timeout = undefined
Object.defineProperties(http, {
  setConfig: {
    value(config) {
      http.prototype.globalConfig = config
    },
  },
  abort: {
    value(key) {
      abortController.abort(key)
    },
  },
  all: {
    value: axios.all,
  },
  spread: {
    value: axios.spread,
  },
})

export default http

import axios from 'axios'
import requestIntercept from './request'
import responseIntercept from './response'
import { setHttpGlobalConfig } from './config'

const http = axios.create()
requestIntercept(http)
responseIntercept(http)

http.defaults.timeout = undefined
Object.defineProperties(http, {
  setConfig: {
    value(config) {
      // http.prototype.globalConfig = config
      setHttpGlobalConfig(config)
    },
  },
  Cancel: {
    value: axios.Cancel,
  },
  CancelToken: {
    value: axios.CancelToken,
  },
  isCancel: {
    value: axios.isCancel,
  },
  all: {
    value: axios.all,
  },
  spread: {
    value: axios.spread,
  },
})

export default http

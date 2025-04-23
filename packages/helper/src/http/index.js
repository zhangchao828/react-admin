import axios from 'axios'
import getInstance from './instance'

const http = (...arg) => getInstance(http)(...arg)

http.all = axios.all
http.spread = axios.spread
// http.axios = axios
http.setConfig = (config) => {
  http.config = config
  getInstance(http)
}
http.getConfig = () => {
  return getInstance(http).getConfig()
}
http.abort = (key) => {
  getInstance(http).abort(key)
}
http.get = (...arg) => getInstance(http).get(...arg)
http.post = (...arg) => getInstance(http).post(...arg)
http.delete = (...arg) => getInstance(http).delete(...arg)
http.put = (...arg) => getInstance(http).put(...arg)
export default http

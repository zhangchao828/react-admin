function pathToArr(path) {
  const index = path.indexOf('?')
  return index > -1 ? path.substring(index + 1).split('&') : []
}
function queryArrToObj(arr) {
  const queryObj = {}
  arr.forEach(function (item) {
    const [key, val] = item.split('=')
    queryObj[key] = val
  })
  return queryObj
}
export default function getLocationQuery(name, config) {
  const { withHash = true, decode = true } = config || {}
  let { hash, search } = window.location || {}
  hash = decode ? decodeURIComponent(hash) : hash
  search = decode ? decodeURIComponent(search) : search
  let hashQueryObj = {}
  const searchQueryObj = queryArrToObj(pathToArr(search))
  if (withHash) {
    hashQueryObj = queryArrToObj(pathToArr(hash))
  }
  if (name) {
    const res = searchQueryObj[name]
    return withHash ? res || hashQueryObj[name] : res
  }
  return withHash ? Object.assign(searchQueryObj, hashQueryObj) : searchQueryObj
}

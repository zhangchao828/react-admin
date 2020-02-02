const lodash = require('lodash')
module.exports = function(defaultExternals, externals) {
  const externalsMap = {}
  const cdnList = []
  let _externals = {}
  if (!lodash.isEmpty(externals)) {
    _externals = lodash.isFunction(externals) ? externals(defaultExternals) : externals
  }
  _externals = Object.assign({}, defaultExternals, _externals)
  Object.keys(_externals).forEach(key => {
    const obj = _externals[key]
    if (lodash.isPlainObject(obj) && obj.name && obj.cdn) {
      externalsMap[key] = obj.name
      cdnList.push(obj.cdn)
    }
  })
  return {
    cdnList,
    externalsMap
  }
}

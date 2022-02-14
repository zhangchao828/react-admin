function isOO(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
export function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}
export function isPlainObject(obj) {
  if (!isOO(obj)) {
    return false
  }
  const ctor = obj.constructor
  if (!isFunction(ctor)) {
    return false
  }
  const proto = ctor.prototype
  if (!isOO(proto)) {
    return false
  }
  return proto.hasOwnProperty('isPrototypeOf')
}
export function isFunction(obj) {
  return typeof obj === 'function'
}
export function isNumber(value) {
  return value !== null && typeof value === 'number' && value - value + 1 === 1
}
export function isString(obj) {
  return typeof obj === 'string'
}
export function isBoolean(obj) {
  return typeof obj === 'boolean'
}
export function isUNN(obj) {
  return obj === null || obj === undefined || Number.isNaN(obj)
}
export function isEmptyObject(obj) {
  for (let key in obj) {
    return false
  }
  return true
}
export function isPromise(obj) {
  return (isObject(obj) || isFunction(obj)) && isFunction(obj.then)
}

function matchEquipment(reg) {
  return reg.test(window.navigator.userAgent)
}
export function isMobile() {
  return matchEquipment(/Android|webOS|iPhone|iPod|BlackBerry/i)
}
export function isAndroid() {
  return matchEquipment(/Android/i)
}
export function isIOS() {
  return matchEquipment(/ip(hone|od|ad)/i)
}
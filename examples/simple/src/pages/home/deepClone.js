const wm = new WeakMap()
function deepClone(target) {
  if (typeof target === 'object') {
    if (target === null) {
      return target
    }
    if (Array.isArray(target)) {
      const copy = []
      target.forEach((item) => copy.push(deepClone(item)))
      return copy
    }
    if (target instanceof Date) {
      return new Date(target)
    }
    if (target instanceof RegExp) {
      return new RegExp(target.source, target.flags)
    }
    if (wm.has(target)) {
      return wm.get(target)
    }
    const copy = {}
    wm.set(target, copy)
    for (let key in target) {
      copy[key] = deepClone(target[key])
    }
    return copy
  }
  return target
}
export default function test() {
  console.log(deepClone({ name: '1' }))
}

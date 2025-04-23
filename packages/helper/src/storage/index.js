function getStorage(name, type) {
  if (typeof name !== 'string') {
    return undefined
  }
  const storage = type === 'local' ? localStorage : sessionStorage
  let data = storage.getItem(name)
  if (data === 'undefined') {
    return undefined
  }
  try {
    return JSON.parse(data)
  } catch (e) {
    return data || null
  }
}
function setStorage(name, value, type) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return
  }
  if (typeof name === 'object') {
    Object.keys(name || {}).forEach((key) => {
      setStorage(key, name[key], type)
    })
  } else if (typeof name === 'string') {
    const storage = type === 'local' ? localStorage : sessionStorage
    const oldValue = getStorage(name, type)
    try {
      if (Array.isArray(value)) {
        value = JSON.stringify(value)
      } else {
        value = typeof value === 'object' ? JSON.stringify({ ...oldValue, ...value }) : value
      }
      storage.setItem(name, value)
    } catch (e) {
      return e
    }
  }
}
export function getLocalStorage(name) {
  return getStorage(name, 'local')
}
export function getSessionStorage(name) {
  return getStorage(name, 'session')
}
export function setLocalStorage(name, value) {
  return setStorage(name, value, 'local')
}
export function setSessionStorage(name, value) {
  return setStorage(name, value, 'session')
}

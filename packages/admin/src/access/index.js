import { useAppContext, getAppContext } from '../app'

function isValidValue(value) {
  return typeof value === 'string' || typeof value === 'number' || Array.isArray(value)
}
function validate(value, access) {
  if (!isValidValue(value)) {
    return false
  }
  if (access === '*') {
    return true
  }
  if (!access) {
    return false
  }
  if (Array.isArray(value)) {
    return value.some((item) => validate(item))
  }
  return Array.isArray(access) ? access.includes(value) : !!access[value]
}
export function Access({ value, children, fallback }) {
  const { access } = useAppContext().data
  if (validate(value, access)) {
    return children
  }
  return fallback === undefined ? null : fallback
}
export function useAccess(value) {
  const { access } = useAppContext().data
  return validate(value, access)
}

Access.validate = (value) => {
  const { access } = getAppContext().data
  return validate(value, access)
}

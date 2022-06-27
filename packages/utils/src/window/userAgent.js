function matchEquipment(reg) {
  return reg.test(window.navigator.userAgent)
}
export function isAndroid() {
  return matchEquipment(/Android/i)
}
export function isIOS() {
  return matchEquipment(/ip(hone|od|ad)/i)
}

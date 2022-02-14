/*
 获取随机字符串可自定义需要的长度默认32
 */
export function getRandomString(len = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = chars.length
  let tmp = ''
  for (let i = 0; i < len; i++) {
    tmp += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return tmp
}
//获取范围内的随机整数
export function getRandomInt(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
//获取范围内的随机数
export function getRandomNumber(min = 0, max = 0) {
  if (max > min) {
    return Math.random() * (max - min) + min
  }
  return Math.random()
}

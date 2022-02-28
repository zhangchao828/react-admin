function longestSubstring(str) {
  const obj = {
    current: '',
    old: '',
  }
  while (str) {
    const s = str[0]
    const index = obj.current.indexOf(s)
    if (index !== -1) {
      // 表示有重复的字符串
      if (obj.current.length > obj.old.length) {
        obj.old = obj.current
      }
      obj.current = str.substring(index, index + 1)
    } else {
      obj.current += s
    }
    str = str.substring(1)
  }
  return obj
}
export default function test() {
  console.log(longestSubstring('asvvsyu'))
}

function longestSubstring(str) {
  let current = ''
  while (str) {
    const s = str[0]
    str = str.substring(1)
  }
  return current.length
}
export default function test() {
  console.log(longestSubstring('11'))
}

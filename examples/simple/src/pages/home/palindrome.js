function palindrome(str) {
  str = str.toLowerCase().replace(/[\W_]/, '')
  return str === str.split('').reverse().join('')
}

export default function test() {
  console.log(palindrome('123321'))
}

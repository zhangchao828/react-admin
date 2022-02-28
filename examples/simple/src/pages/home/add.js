function add(...args) {
  const fn = add.bind(null, ...args)
  fn.toString = () => args.reduce((p, n) => p + n, 0)
  return fn
}
export default function test() {
  console.log(add(1))
}

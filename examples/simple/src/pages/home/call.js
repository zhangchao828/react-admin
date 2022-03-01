function call(context, ...arg) {
  context = context ? Object(context) : window
  context.fn = this
  let res = context.fn(...arg)
  delete context.fn
  return res
}
function apply(context, arg) {
  context = context ? Object(context) : window
  context.fn = this
  let res = context.fn(...arg)
  delete context.fn
  return res
}
function bind(context, ...arg) {
  const self = this
  return function (...arg2) {
    self.apply(context, [...arg, ...arg2])
  }
}

function fastSort(arr) {
  if (arr.length <= 1) {
    return arr
  }
  const index = Math.floor(arr.length / 2)
  const value = arr.splice(index, 1)
  const left = []
  const right = []
  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i]
    if (curr > value) {
      right.push(curr)
    } else {
      left.push(curr)
    }
  }
  return fastSort(left).concat(value, fastSort(right))
}
function bubbleSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}
export default function test() {
  // console.log(fastSort([3, 2]))
  // console.log(fastSort([3, 1, 5, 3, 2, 69, 32, 1]))
  console.log(bubbleSort([3, 2]))
  console.log(bubbleSort([3, 1, 5, 3, 2, 69, 32, 1]))
}

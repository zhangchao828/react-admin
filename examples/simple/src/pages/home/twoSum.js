function twoSum(arr, target) {
  const map = new Map()
  for (let i = 0; i < arr.length; i++) {
    const rest = target - arr[i]
    if (map.has(rest)) {
      return [map.get(rest), i]
    }
    map.set(arr[i], i)
  }
}

export default function test() {
  console.log(twoSum([6, 1, 2, 3, 6, 4], 10))
}

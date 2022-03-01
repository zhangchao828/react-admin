function threeSum(nums) {
  const result = []
  nums.sort((a, b) => a - b)
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue
    }
    let left = i + 1
    let right = nums.length - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum > 0) {
        right--
      } else if (sum < 0) {
        left++
      } else {
        result.push([nums[i], nums[left], nums[right]])
        left++
        right--
        if (nums[left] === nums[left - 1]) {
          left++
        }
        if (nums[right] === nums[right + 1]) {
          right--
        }
      }
    }
  }
  return result
}

function test() {
  console.log(threeSum([1, 2, -3]))
}
test()

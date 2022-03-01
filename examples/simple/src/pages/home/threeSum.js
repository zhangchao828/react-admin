function threeSum(nums) {
  const result = []
  //从小到大排列
  nums.sort((a, b) => a - b)
  for (let i = 0; i < nums.length; i++) {
    // 跳过重复数字
    if (i && nums[i] === nums[i - 1]) {
      continue
    }
    //左指针
    let left = i + 1
    //右指针
    let right = nums.length - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum > 0) {
        right--
      } else if (sum < 0) {
        left++
      } else {
        //值=0 加入结果数组
        result.push([nums[i], nums[left], nums[right]])
        left++
        right--
        //继续移动指针寻找
        // 跳过重复数字
        while (nums[left] === nums[left - 1]) {
          left++
        }
        // 跳过重复数字
        while (nums[right] === nums[right + 1]) {
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

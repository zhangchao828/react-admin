class RangeList {
  constructor() {
    this.list = []
  }
  generateArr(min, max) {
    return min >= max ? [] : Array.from(new Array(max).keys()).slice(min)
  }
  add(range) {
    this.list = [...new Set(this.list.concat(this.generateArr(...range)))].sort((a, b) => a - b)
  }
  remove(range) {
    const arr = this.generateArr(...range)
    arr.forEach((item) => {
      const index = this.list.findIndex((node) => node === item)
      if (index !== -1) {
        this.list.splice(index, 1)
      }
    })
  }
  print() {
    const obj = {}
    const len = this.list.length
    let key = 0
    for (let i = 0; i < len; i++) {
      const current = this.list[i]
      if (obj[key]) {
        obj[key].push(current)
      } else {
        obj[key] = [current]
      }
      const next = i === len - 1 ? null : this.list[i + 1]
      if (next === null || Math.abs(next - current) !== 1) {
        key++
      }
    }
    const res = []
    Object.values(obj).forEach((item) => {
      const start = item[0]
      const end = item[item.length - 1]
      res.push(`[${start}, ${end + 1})`)
    })
    console.log(res.join(' '))
  }
}
export default function Home() {
  // Example run
  const rl = new RangeList()
  rl.add([1, 5])
  rl.print()
  // Should display: [1, 5)
  rl.add([10, 20])
  rl.print()
  // Should display: [1, 5) [10, 20)
  rl.add([20, 20])
  rl.print()
  // Should display: [1, 5) [10, 20)
  rl.add([20, 21])
  rl.print()
  // Should display: [1, 5) [10, 21)
  rl.add([2, 4])
  rl.print()
  // Should display: [1, 5) [10, 21)
  rl.add([3, 8])
  rl.print()
  // Should display: [1, 8) [10, 21)
  rl.remove([10, 10])
  rl.print()
  // Should display: [1, 8) [10, 21)
  rl.remove([10, 11])
  rl.print()
  // Should display: [1, 8) [11, 21)
  rl.remove([15, 17])
  rl.print()
  // Should display: [1, 8) [11, 15) [17, 21)
  rl.remove([3, 19])
  rl.print()
  // Should display: [1, 3) [19, 21)
  return <div>Range</div>
}

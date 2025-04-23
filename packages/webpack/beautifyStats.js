const chalk = require('chalk')
const Table = require('cli-table')
const { extname } = require('path')
const { success } = require('@glcc/shared/message')

function beautifyStats(stats) {
  const statsJson = stats.toJson()
  const { time, assets } = statsJson
  const resTime = time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(2)}s`
  const table = new Table({
    head: ['Path', 'Hash', 'Size', 'Type'],
    chars: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
  })
  assets.forEach((item) => {
    let { name, size } = item
    const m1 = 1024 * 1024
    const k1 = 1024
    const k200 = 1024 * 200
    let resSize = ''
    if (size > m1) {
      resSize = `${(size / m1).toFixed(2)} M`
    } else {
      resSize = size > k1 ? `${(size / k1).toFixed(2)} Kb` : `${size} B`
    }
    if (size >= k200) {
      resSize = chalk.hex('#FFF40F').bold(resSize)
    }
    const type = extname(name)
    if (name.indexOf('js/') === 0) {
      name = name.substring(3)
    } else if (name.indexOf('css/') === 0) {
      name = name.substring(4)
    }
    const [f, hash, l] = name.split('.')
    name = [f, l || hash].join('.')
    if (name !== 'index.html' && name.length > 40) {
      const nameSplit = name.split('/')
      name = nameSplit[0] + '/.../' + nameSplit[nameSplit.length - 1]
    }
    table.push([name, hash === 'html' ? '' : hash, resSize, type.substring(1)])
  })
  console.log(chalk.blue(table.toString()))
  success(`总耗时：${resTime}`)
}

module.exports = beautifyStats

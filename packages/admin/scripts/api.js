#!/usr/bin/env node
const ora = require('ora')
const Generator = require('@glcc/yapi2ts/Generator')
const write = require('@glcc/yapi2ts/write')
const { getConfig } = require('@glcc/shared/project')
const { yapi2ts } = getConfig()
const message = require('@glcc/shared/message')

module.exports = async function run() {
  const cwd = process.cwd()
  let generator
  let spinner
  try {
    generator = new Generator(yapi2ts, { cwd })
    spinner = ora('正在获取数据并生成代码...').start()
    const output = await generator.generate()
    spinner.stop()
    message.success('获取数据并生成代码完毕')
    await write(output)
    const filePath = Object.keys(output)
      .map((v) => output[v].filePath)
      .join('\n')
    message.success(`已生成文件 \n${filePath} `)
  } catch (err) {
    spinner?.stop()
    message.error(err)
  }
}

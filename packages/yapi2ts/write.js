const prettier = require('prettier')
const { dedent } = require('./utils')
const { exec } = require('child_process')
const _ = require('lodash')
const fs = require('fs-extra')

async function getPrettierOptions() {
  const prettierOptions = {
    parser: 'typescript',
    printWidth: 120,
    tabWidth: 2,
    singleQuote: true,
    semi: false,
    trailingComma: 'all',
    bracketSpacing: true,
    endOfLine: 'lf',
  }

  // 测试时跳过本地配置的解析
  if (process.env.JEST_WORKER_ID) {
    return prettierOptions
  }

  const prettierConfigPath = await prettier.resolveConfigFile()
  if (!prettierConfigPath) {
    return prettierOptions
  }

  const prettierConfig = await prettier.resolveConfig(prettierConfigPath)
  if (!prettierConfig) {
    return prettierOptions
  }

  return {
    ...prettierOptions,
    ...prettierConfig,
    parser: 'typescript',
  }
}

const write = async (outputFileList) => {
  return Promise.all(
    Object.keys(outputFileList).map(async (outputFilePath) => {
      let {
        // eslint-disable-next-line prefer-const
        content,
        syntheticalConfig,
        fileType,
        outFileName,
      } = outputFileList[outputFilePath]
      const isApi = fileType === 'api'
      outFileName = outFileName.replace(/\.ts?$/, '')

      // 始终写入主文件
      const interfaceOutputContent = dedent`
        /* tslint:disable */
        /* eslint-disable */

        /* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

        ${dedent`
              // @ts-ignore

              ${content.trim()}
            `}
      `
      const apiOutputContent = dedent`
        import * as Types from "./interface/${outFileName}";
        import { http } from '@glcc/admin'
        
         const mock = false
        // const mock= { mode:2 }
      ${dedent`
export default {
            ${content.trim()}
}
          `}
    `
      // ref: https://prettier.io/docs/en/options.html
      const prettyOutputContent = prettier.format(
        isApi ? apiOutputContent : interfaceOutputContent,
        {
          ...(await getPrettierOptions()),
          filepath: outputFilePath,
        }
      )
      const outputContent = `${dedent`
        /* prettier-ignore-start */
        ${prettyOutputContent}
        /* prettier-ignore-end */
      `}\n`
      await fs.outputFile(outputFilePath, outputContent)

      // 如果要生成 JavaScript 代码，
      // 则先对主文件进行 tsc 编译，主文件引用到的其他文件也会被编译，
      // 然后，删除原始的 .tsx? 文件。
      if (syntheticalConfig.target === 'javascript') {
        await tsc(outputFilePath)
        await Promise.all([fs.remove(outputFilePath).catch(_.noop)])
      }
    })
  )
}

const tsc = async (file) => {
  return new Promise((resolve) => {
    // add this to fix bug that not-generator-file-on-window
    const command = `${require('os').platform() === 'win32' ? 'node ' : ''}${JSON.stringify(
      require.resolve(`typescript/bin/tsc`)
    )}`

    exec(
      `${command} --target ES2019 --module ESNext --jsx preserve --declaration --esModuleInterop ${JSON.stringify(
        file
      )}`,
      {
        cwd: this.options?.cwd,
        env: process.env,
      },
      () => resolve()
    )
  })
}

module.exports = write

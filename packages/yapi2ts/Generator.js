const changeCase = require('change-case')
const _ = require('lodash')
const path = require('path')
const dayjs = require('dayjs')
const { getCategoryList } = require('./request')
const {
  getRequestDataJsonSchema,
  getResponseDataJsonSchema,
  jsonSchemaToType,
  getHttpJson,
  dedent,
} = require('./utils')

const defaultConfig = {
  fileName: (interfaceInfo, changeCase) => {
    const category = interfaceInfo._category
    let fileName = category?.catId
    if (category?.desc) {
      fileName = changeCase.camelCase(category.desc?.replace(/\s+/g, ''))
    }
    return `${fileName}.ts`
  },
  basePath: 'src/api/',
}
class Generator {
  /** 配置 */
  config = {}
  disposes = []

  constructor(config, options = { cwd: process.cwd() }) {
    this.config = Object.assign(this.config, defaultConfig, config)
    this.options = options
  }
  getChangeName = async (syntheticalConfig, extendedInterfaceInfo) => {
    const requestName = extendedInterfaceInfo.parsedPath.dir.split('/').slice(-1).join('')
    const requestFunctionName = _.isFunction(syntheticalConfig?.getRequestFunctionName)
      ? await syntheticalConfig?.getRequestFunctionName(extendedInterfaceInfo, changeCase)
      : changeCase.camelCase(`${requestName} ${extendedInterfaceInfo.parsedPath.name}`)

    const requestDataTypeName = _.isFunction(syntheticalConfig?.getRequestDataTypeName)
      ? await syntheticalConfig?.getRequestDataTypeName(extendedInterfaceInfo, changeCase)
      : changeCase.pascalCase(`${requestFunctionName}Request`)

    const responseDataTypeName = _.isFunction(syntheticalConfig?.getResponseDataTypeName)
      ? await syntheticalConfig?.getResponseDataTypeName(extendedInterfaceInfo, changeCase)
      : changeCase.pascalCase(`${requestFunctionName}Response`)

    const requestDataJsonSchema = getRequestDataJsonSchema(
      extendedInterfaceInfo,
      syntheticalConfig?.customTypeMapping || {}
    )
    // console.log(
    // 	requestDataJsonSchema,
    // 	requestDataTypeName,
    // 	"requestDataJsonSchema"
    // );
    const requestDataType = await jsonSchemaToType(requestDataJsonSchema, requestDataTypeName)
    // console.log(requestDataType, "requestDataType");
    const responseDataJsonSchema = getResponseDataJsonSchema(
      extendedInterfaceInfo,
      syntheticalConfig?.customTypeMapping || {},
      syntheticalConfig?.dataKey
    )
    const responseDataType = await jsonSchemaToType(responseDataJsonSchema, responseDataTypeName)

    const path = extendedInterfaceInfo.path.toLowerCase()
    const isImport = _.isFunction(syntheticalConfig?.isImport)
      ? await syntheticalConfig?.isImport(extendedInterfaceInfo)
      : path.indexOf('import') !== -1

    const isDownload = _.isFunction(syntheticalConfig?.isDownload)
      ? await syntheticalConfig?.isDownload(extendedInterfaceInfo)
      : path.indexOf('export') !== -1 || path.indexOf('download') !== -1
    const httpJson = await getHttpJson(
      extendedInterfaceInfo,
      requestDataTypeName,
      responseDataTypeName,
      isImport,
      isDownload
    )
    return {
      requestDataType,
      responseDataType,
      responseDataTypeName,
      requestDataTypeName,
      httpJson,
    }
  }
  generateInterfaceCode = async (syntheticalConfig, interfaceInfo) => {
    const extendedInterfaceInfo = {
      ...interfaceInfo,
      parsedPath: path.parse(interfaceInfo.path),
    }
    // console.log(extendedInterfaceInfo, "extendedInterfaceInfo");
    const { requestDataType, responseDataType, httpJson } = await this.getChangeName(
      syntheticalConfig,
      extendedInterfaceInfo
    )
    // 转义标题中的 /
    const escapedTitle = String(extendedInterfaceInfo.title).replace(/\//g, '\\/')
    // 接口注释
    const genComment = (genTitle) => {
      const {
        enabled: isEnabled = true,
        title: hasTitle = true,
        category: hasCategory = true,
        tag: hasTag = true,
        requestHeader: hasRequestHeader = true,
        updateTime: hasUpdateTime = true,
        link: hasLink = true,
        extraTags,
      } = {
        ...syntheticalConfig.comment,
        // Swagger 时总是禁用标签、更新时间、链接
        ...(syntheticalConfig.serverType === 'swagger'
          ? {
            tag: false,
            updateTime: false,
            link: false,
          }
          : {}),
      }
      if (!isEnabled) {
        return ''
      }

      const description = hasLink
        ? `[${escapedTitle}↗](${extendedInterfaceInfo._url})`
        : escapedTitle
      const summary = [
        hasCategory && {
          label: '分类',
          value: hasLink
            ? `[${extendedInterfaceInfo._category.name}↗](${extendedInterfaceInfo._category._url})`
            : extendedInterfaceInfo._category.name,
        },
        hasTag && {
          label: '标签',
          value: extendedInterfaceInfo.tag.map((tag) => `\`${tag}\``),
        },
        hasRequestHeader && {
          label: '请求头',
          value: `\`${extendedInterfaceInfo.method.toUpperCase()} ${extendedInterfaceInfo.path}\``,
        },
        hasUpdateTime && {
          label: '更新时间',
          value: process.env.JEST_WORKER_ID // 测试时使用 unix 时间戳
            ? String(extendedInterfaceInfo.up_time)
            : /* istanbul ignore next */
            `\`${dayjs(extendedInterfaceInfo.up_time * 1000).format('YYYY-MM-DD HH:mm:ss')}\``,
        },
      ]
      if (typeof extraTags === 'function') {
        const tags = extraTags(extendedInterfaceInfo)
        for (const tag of tags) {
          ; (tag.position === 'start' ? summary.unshift : summary.push).call(summary, {
            label: tag.name,
            value: tag.value,
          })
        }
      }
      const titleComment = hasTitle
        ? dedent`
          * ${genTitle(description)}
          *
        `
        : ''
      const extraComment = summary
        .filter((item) => typeof item !== 'boolean' && !_.isEmpty(item.value))
        .map((item) => {
          const _item = item
          return `* @${_item.label} ${_.castArray(_item.value).join(', ')}`
        })
        .join('\n')
      return dedent`
      /**
       ${[titleComment, extraComment].filter(Boolean).join('\n')}
       */
    `
    }
    const interFaceCode = dedent`
    ${genComment((title) => `接口 ${title} 的 **请求类型**`)}
    ${requestDataType?.trim()}
  
    ${genComment((title) => `接口 ${title} 的 **返回类型**`)}
    ${responseDataType?.trim()}
  `
    const httpCode = dedent`
    // ${escapedTitle}
    ${httpJson?.trim()}
  `
    return {
      httpCode,
      interFaceCode,
    }
  }
  generate = async () => {
    const { serverUrl, token, ids, basePath, fileName } = this.config
    if (!serverUrl || !token || !ids) {
      throw new Error('serverUrl、token、ids 不能为空')
    }
    const { cwd } = this.options
    const categoryList = await getCategoryList({ serverUrl, token })
    const syntheticalConfig = this.config
    const interfaceList = ids.map((id) => {
      const category = categoryList.find((cat) => cat?.catId === id)
      if (category) {
        category.list.forEach((interfaceInfo) => {
          // 实现 _category 字段
          interfaceInfo._category = _.omit(category, ['list'])
        })
      }
      return category ? category.list : []
    })
    const outputFileList = await Promise.all(
      interfaceList.map(async (interfaceInfo, categoryIndex) => {
        const codeList = []
        await Promise.all(
          interfaceInfo.map(async (file, categoryIndex2) => {
            const categoryUID = `_${categoryIndex}_${categoryIndex2}`
            const { interFaceCode, httpCode } = await this.generateInterfaceCode(
              syntheticalConfig,
              file
            )
            const yapiMockUrl = `${syntheticalConfig?.serverUrl}/mock/${file?.project_id}`
            const outFileName =
              typeof fileName === 'function' ? fileName(file, changeCase) : fileName
            const outputFilePath = path.resolve(cwd, `${basePath}${outFileName}`)
            const interfacOutputFilePath = path.resolve(cwd, `${basePath}interface/${outFileName}`)
            codeList.push({
              categoryUID,
              outputFilePath: interfacOutputFilePath,
              code: interFaceCode,
              outFileName,
              fileType: 'interface',
              filePath: `${basePath}${outFileName}`,
              yapiMockUrl,
            })
            codeList.push({
              categoryUID,
              outputFilePath,
              code: httpCode,
              outFileName,
              fileType: 'api',
              filePath: `${basePath}interface/${outFileName}`,
              yapiMockUrl,
            })
          })
        )
        const groupedInterfaceCodes = _.groupBy(codeList, (item) => item.outputFilePath)
        const outputFile = {}
        for (const groupCode in groupedInterfaceCodes) {
          if (!outputFile[groupCode]) {
            outputFile[groupCode] = {}
          }
          const { filePath, fileType, outFileName, yapiMockUrl } =
            groupedInterfaceCodes[groupCode]?.[0] || {}
          outputFile[groupCode].content = groupedInterfaceCodes[groupCode]
            .map((v) => v.code)
            .join('\n\n')
          outputFile[groupCode].syntheticalConfig = syntheticalConfig
          outputFile[groupCode].filePath = filePath
          outputFile[groupCode].fileType = fileType
          outputFile[groupCode].outFileName = outFileName
          outputFile[groupCode].yapiMockUrl = yapiMockUrl
        }
        return outputFile
      })
    )
    // write(outputFileList);
    const outputFileLists = Object.assign({}, ...outputFileList)

    return outputFileLists
  }
}

module.exports = Generator

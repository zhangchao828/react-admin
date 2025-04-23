// import { RequestFormItemType } from "./utils";
// import { Required } from "./utils";
// import { RequestBodyType } from "./utils";

const _ = require('lodash')
const path = require('path')
const changeCase = require('change-case')
const toJsonSchema = require('to-json-schema')

const { compile, Options } = require('json-schema-to-typescript')
/**
 * 遍历对象和数组。
 *
 * @param value 要遍历的值
 * @param callback 遍历回调
 * @returns 返回结果
 * @example
 * ```typescript
 * traverse([1, 2, {3: 4}], value => {
 *   console.log(value)
 *   // => 1
 *   // => 2
 *   // => {3: 4}
 *   // => 4
 * })
 * ```
 */
function traverse(value, callback) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      callback(item, index, value)
      if (value[index] !== undefined) {
        traverse(item, callback)
      }
    })
  } else if (_._.isPlainObject(value)) {
    _.forOwn(value, (item, key) => {
      callback(item, key, value)
      if (_.has(value, key)) {
        traverse(item, callback)
      }
    })
  }
}
/**
 * 将路径统一为 unix 风格的路径。
 *
 * @param path 路径
 * @returns unix 风格的路径
 */
function toUnixPath(path) {
  return path.replace(/[/\\]+/g, '/')
}
const JSTTOptions = {
  bannerComment: '',
  style: {
    bracketSpacing: false,
    printWidth: 120,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false,
  },
}
function isGetLikeMethod(method) {
  return (
    // method === Method.GET || method === Method.OPTIONS || method === Method.HEAD
    method === 'GET' || method === 'OPTIONS' || method === 'HEAD'
  )
}

function isPostLikeMethod(method) {
  return !isGetLikeMethod(method)
}
/**
 * 将 JSONSchema 字符串转为 JSONSchema 对象。
 *
 * @param str 要转换的 JSONSchema 字符串
 * @returns 转换后的 JSONSchema 对象
 */
function jsonSchemaStringToJsonSchema(str, customTypeMapping) {
  return processJsonSchema(JSON.parse(str), customTypeMapping)
}

/**
 * 原地遍历 JSONSchema。
 */
function traverseJsonSchema(jsonSchema, cb, currentPath = []) {
  /* istanbul ignore if */
  if (!_.isObject(jsonSchema)) return jsonSchema

  // Mock.toJSONSchema 产生的 properties 为数组，然而 JSONSchema4 的 properties 为对象
  if (_.isArray(jsonSchema.properties)) {
    jsonSchema.properties = jsonSchema.properties.reduce((props, js) => {
      props[js.name] = js
      return props
    }, {})
  }

  // 处理传入的 JSONSchema
  cb(jsonSchema, currentPath)

  // 继续处理对象的子元素
  if (jsonSchema.properties) {
    _.forOwn(jsonSchema.properties, (item, key) =>
      traverseJsonSchema(item, cb, [...currentPath, key])
    )
  }

  // 继续处理数组的子元素
  if (jsonSchema.items) {
    _.castArray(jsonSchema.items).forEach((item, index) =>
      traverseJsonSchema(item, cb, [...currentPath, index])
    )
  }

  // 处理 oneOf
  if (jsonSchema.oneOf) {
    jsonSchema.oneOf.forEach((item) => traverseJsonSchema(item, cb, currentPath))
  }

  // 处理 anyOf
  if (jsonSchema.anyOf) {
    jsonSchema.anyOf.forEach((item) => traverseJsonSchema(item, cb, currentPath))
  }

  // 处理 allOf
  if (jsonSchema.allOf) {
    jsonSchema.allOf.forEach((item) => traverseJsonSchema(item, cb, currentPath))
  }

  return jsonSchema
}

/**
 * 原地处理 JSONSchema。
 *
 * @param jsonSchema 待处理的 JSONSchema
 * @returns 处理后的 JSONSchema
 */
function processJsonSchema(jsonSchema, customTypeMapping) {
  return traverseJsonSchema(
    jsonSchema,
    (jsonSchema) => {
      // 删除通过 swagger 导入时未剔除的 ref
      delete jsonSchema.$ref
      delete jsonSchema.$$ref
      // 数组只取第一个判断类型
      if (
        jsonSchema.type === 'array' &&
        Array.isArray(jsonSchema.items) &&
        jsonSchema.items.length
      ) {
        jsonSchema.items = jsonSchema.items[0]
      }

      // 处理类型名称为标准的 JSONSchema 类型名称
      if (jsonSchema.type) {
        // 类型映射表，键都为小写
        const typeMapping = {
          byte: 'integer',
          short: 'integer',
          int: 'integer',
          long: 'integer',
          float: 'number',
          double: 'number',
          bigdecimal: 'number',
          char: 'string',
          void: 'null',
          ..._.mapKeys(customTypeMapping, (_, key) => key.toLowerCase()),
        }
        const isMultiple = Array.isArray(jsonSchema.type)
        const types = _.castArray(jsonSchema.type).map((type) => {
          // 所有类型转成小写，如：String -> string
          type = type.toLowerCase()
          // 映射为标准的 JSONSchema 类型
          type = typeMapping[type] || type
          return type
        })
        jsonSchema.type = isMultiple ? types : types[0]
      }

      // 移除字段名称首尾空格
      if (jsonSchema.properties) {
        _.forOwn(jsonSchema.properties, (_, prop) => {
          const propDef = jsonSchema.properties[prop]
          delete jsonSchema.properties[prop]
          jsonSchema.properties[prop.trim()] = propDef
        })
        if (Array.isArray(jsonSchema.required)) {
          jsonSchema.required = jsonSchema.required.map((prop) => prop.trim())
        }
      }

      return jsonSchema
    },
    []
  )
}
/**
 * 获得属性定义列表的 JSONSchema 对象。
 *
 * @param propDefinitions 属性定义列表
 * @returns JSONSchema 对象
 */
function propDefinitionsToJsonSchema(propDefinitions, customTypeMapping) {
  return processJsonSchema(
    {
      type: 'object',
      required: propDefinitions.reduce((res, prop) => {
        if (prop.required) {
          res.push(prop.name)
        }
        return res
      }, []),
      properties: propDefinitions.reduce((res, prop) => {
        res[prop.name] = {
          type: prop.type,
          description: prop.comment,
          ...(prop.type === 'file' ? { tsType: 'File' } : {}),
        }
        return res
      }, {}),
    },
    customTypeMapping
  )
}

/**
 * 获得 JSON 数据的 JSONSchema 对象。
 *
 * @param json JSON 数据
 * @returns JSONSchema 对象
 */
function jsonToJsonSchema(json, customTypeMapping) {
  const schema = toJsonSchema(json, {
    required: false,
    arrays: {
      mode: 'first',
    },
    objects: {
      additionalProperties: false,
    },
    strings: {
      detectFormat: false,
    },
    postProcessFnc: (type, schema, value) => {
      if (!schema.description && !!value && type !== 'object') {
        schema.description = JSON.stringify(value)
      }
      return schema
    },
  })
  delete schema.description
  return processJsonSchema(schema, customTypeMapping)
}
function getRequestDataJsonSchema(interfaceInfo, customTypeMapping) {
  let jsonSchema

  // 处理表单数据（仅 POST 类接口）
  if (isPostLikeMethod(interfaceInfo.method)) {
    switch (interfaceInfo.req_body_type) {
      case 'form':
        jsonSchema = propDefinitionsToJsonSchema(
          interfaceInfo.req_body_form.map((item) => ({
            name: item.name,
            required: item.required === '1',
            type: item.type === 'file' ? 'file' : 'string',
            comment: item.desc,
          })),
          customTypeMapping
        )
        break
      case 'json':
        if (interfaceInfo.req_body_other) {
          jsonSchema = interfaceInfo.req_body_is_json_schema
            ? jsonSchemaStringToJsonSchema(interfaceInfo.req_body_other, customTypeMapping)
            : jsonToJsonSchema(JSON.parse(interfaceInfo.req_body_other), customTypeMapping)
        }
        break
      default:
        /* istanbul ignore next */
        break
    }
  }

  // 处理查询数据
  if (_.isArray(interfaceInfo.req_query) && interfaceInfo.req_query.length) {
    const queryJsonSchema = propDefinitionsToJsonSchema(
      interfaceInfo.req_query.map((item) => ({
        name: item.name,
        required: item.required === '1',
        type: item.type || 'string',
        comment: item.desc,
      })),
      customTypeMapping
    )
    /* istanbul ignore else */
    if (jsonSchema) {
      jsonSchema.properties = {
        ...jsonSchema.properties,
        ...queryJsonSchema.properties,
      }
      jsonSchema.required = [
        ...(Array.isArray(jsonSchema.required) ? jsonSchema.required : []),
        ...(Array.isArray(queryJsonSchema.required) ? queryJsonSchema.required : []),
      ]
    } else {
      jsonSchema = queryJsonSchema
    }
  }

  // 处理路径参数
  if (_.isArray(interfaceInfo.req_params) && interfaceInfo.req_params.length) {
    const paramsJsonSchema = propDefinitionsToJsonSchema(
      interfaceInfo.req_params.map((item) => ({
        name: item.name,
        required: true,
        type: item.type || 'string',
        comment: item.desc,
      })),
      customTypeMapping
    )
    /* istanbul ignore else */
    if (jsonSchema) {
      jsonSchema.properties = {
        ...jsonSchema.properties,
        ...paramsJsonSchema.properties,
      }
      jsonSchema.required = [
        ...(Array.isArray(jsonSchema.required) ? jsonSchema.required : []),
        ...(Array.isArray(paramsJsonSchema.required) ? paramsJsonSchema.required : []),
      ]
    } else {
      jsonSchema = paramsJsonSchema
    }
  }

  return jsonSchema || {}
}

/**
 * 获得 mockjs 模板的 JSONSchema 对象。
 *
 * @param template mockjs 模板
 * @returns JSONSchema 对象
 */
function mockjsTemplateToJsonSchema(template, customTypeMapping) {
  const actions = []
  // https://github.com/nuysoft/Mock/blob/refactoring/src/mock/constant.js#L27
  const keyRe = /(.+)\|(?:\+(\d+)|([+-]?\d+-?[+-]?\d*)?(?:\.(\d+-?\d*))?)/
  // https://github.com/nuysoft/Mock/wiki/Mock.Random
  const numberPatterns = ['natural', 'integer', 'float', 'range', 'increment']
  const boolPatterns = ['boolean', 'bool']
  const normalizeValue = (value) => {
    if (typeof value === 'string' && value.startsWith('@')) {
      const pattern = value.slice(1)
      if (numberPatterns.some((p) => pattern.startsWith(p))) {
        return 1
      }
      if (boolPatterns.some((p) => pattern.startsWith(p))) {
        return true
      }
    }
    return value
  }
  traverse(template, (value, key, parent) => {
    if (typeof key === 'string') {
      actions.push(() => {
        delete parent[key]
        parent[
          // https://github.com/nuysoft/Mock/blob/refactoring/src/mock/schema/schema.js#L16
          key.replace(keyRe, '$1')
        ] = normalizeValue(value)
      })
    }
  })
  actions.forEach((action) => action())
  return jsonToJsonSchema(template, customTypeMapping)
}
function getResponseDataJsonSchema(interfaceInfo, customTypeMapping, dataKey) {
  let jsonSchema

  switch (interfaceInfo.res_body_type) {
    case 'json':
      if (interfaceInfo.res_body) {
        jsonSchema = interfaceInfo.res_body_is_json_schema
          ? jsonSchemaStringToJsonSchema(interfaceInfo.res_body, customTypeMapping)
          : mockjsTemplateToJsonSchema(JSON.parse(interfaceInfo.res_body), customTypeMapping)
      }
      break
    default:
      jsonSchema = { __is_any__: true }
      break
  }

  if (dataKey && jsonSchema) {
    jsonSchema = reachJsonSchema(jsonSchema, dataKey)
  }

  return jsonSchema
}
const getNamePath = ({ path, method }) => {
  const newPath = path.split('/')
  const newName = `${method} ${newPath.slice(-2).join(' ')}`

  return changeCase.camelCase(newName)
}
const getHttpJson = (
  interfaceInfo,
  requestDataTypeName,
  responseDataTypeName,
  isImport,
  isDownload
) => {
  let jsonSchema

  const name = getNamePath(interfaceInfo)
  const type = isDownload ? `,type:'download'` : isImport ? ",type:'upload'" : ''
  if (interfaceInfo.method === 'GET') {
    return indent`
    ${name}:(params: Types.${requestDataTypeName}) :Promise< Types.${responseDataTypeName}>  => http.get('${interfaceInfo.path}', { params , mock ${type}} ),
    `
  }
  if (interfaceInfo.method === 'POST') {
    return indent`
    ${name}: (data: Types.${requestDataTypeName}) : Promise<Types.${responseDataTypeName}>  => http.post('${interfaceInfo.path}',data, { mock ${type}}),
    `
  }
  return jsonSchema
}
function reachJsonSchema(jsonSchema, path) {
  let last = jsonSchema
  for (const segment of _.castArray(path)) {
    const _last = last.properties?.[segment]
    if (!_last) {
      return jsonSchema
    }
    last = _last
  }
  return last
}
/**
 * 获取适用于 JSTT 的 JSONSchema。
 *
 * @param jsonSchema 待处理的 JSONSchema
 * @returns 适用于 JSTT 的 JSONSchema
 */
function jsonSchemaToJSTTJsonSchema(jsonSchema, typeName) {
  if (jsonSchema) {
    // 去除最外层的 description 以防止 JSTT 提取它作为类型的注释
    delete jsonSchema.description
  }
  return traverseJsonSchema(
    jsonSchema,
    (jsonSchema, currentPath) => {
      // 支持类型引用
      const refValue =
        // YApi 低版本不支持配置 title，可以在 description 里配置
        jsonSchema.title == null ? jsonSchema.description : jsonSchema.title
      if (refValue?.startsWith('&')) {
        const typeRelativePath = refValue.substring(1)
        const typeAbsolutePath = toUnixPath(
          path
            .resolve(
              path.dirname(`/${currentPath.join('/')}`.replace(/\/{2,}/g, '/')),
              typeRelativePath
            )
            .replace(/^[a-z]+:/i, '')
        )
        const typeAbsolutePathArr = typeAbsolutePath.split('/').filter(Boolean)

        let tsTypeLeft = ''
        let tsTypeRight = typeName
        for (const key of typeAbsolutePathArr) {
          tsTypeLeft += 'NonNullable<'
          tsTypeRight += `[${JSON.stringify(key)}]>`
        }
        const tsType = `${tsTypeLeft}${tsTypeRight}`

        jsonSchema.tsType = tsType
      }

      // 去除 title 和 id，防止 json-schema-to-typescript 提取它们作为接口名
      delete jsonSchema.title
      delete jsonSchema.id

      // 忽略数组长度限制
      delete jsonSchema.minItems
      delete jsonSchema.maxItems

      if (jsonSchema.type === 'object') {
        // 将 additionalProperties 设为 false
        jsonSchema.additionalProperties = false
      }

      // 删除 default，防止 json-schema-to-typescript 根据它推测类型
      delete jsonSchema.default

      return jsonSchema
    },
    undefined
  )
}
/**
 * 根据 JSONSchema 对象生产 TypeScript 类型定义。
 *
 * @param jsonSchema JSONSchema 对象
 * @param typeName 类型名称
 * @returns TypeScript 类型定义
 */
async function jsonSchemaToType(jsonSchema, typeName) {
  if (_.isEmpty(jsonSchema)) {
    return `export interface ${typeName} {}`
  }
  if (jsonSchema.__is_any__) {
    delete jsonSchema.__is_any__
    return `export type ${typeName} = any`
  }
  // JSTT 会转换 typeName，因此传入一个全大写的假 typeName，生成代码后再替换回真正的 typeName
  const fakeTypeName = 'THISISAFAKETYPENAME'
  const code = await compile(
    jsonSchemaToJSTTJsonSchema(_.cloneDeep(jsonSchema), typeName),
    fakeTypeName,
    JSTTOptions
  )
  // console.log(code, "jsonSchemaToType");
  return code.replace(fakeTypeName, typeName).trim()
}
/**
 * 每一行紧跟前导空白的插入值为多行时，保持缩进。
 *
 * @public
 * @param literals 字面值
 * @param interpolations 插入值
 * @returns 返回处理后的结果
 * @example
 * ```typescript
 * indent` ${'a\nb'}` // => ' a\n b'
 * ```
 */
function indent(literals, ...interpolations) {
  let result = ''

  for (let i = 0; i < interpolations.length; i++) {
    const literal = literals[i]
    let interpolation = interpolations[i]
    const match = literal.match(/(?:^|[\r\n]+)([^\S\r\n]*)$/)
    if (match && match[1]) {
      interpolation = String(interpolation).replace(
        // fix: 后行断言部分浏览器暂不支持
        // /(?<=[\r\n]+)(?=[^\r\n])/g,
        /([\r\n]+)(?=[^\r\n])/g,
        `$1${match[1]}`
      )
    }
    result += literal
    result += interpolation
  }

  result += literals[literals.length - 1]

  return result
}

/**
 * 首先，每一行紧跟前导空白的插入值为多行时，保持缩进。
 * 然后，移除每一行的公共前导空白。
 *
 * @public
 * @param literals 字面值
 * @param interpolations 插入值
 * @returns 返回处理后的结果
 * @example
 * ```typescript
 * dedent` a\n b` // => 'a\nb'
 * ```
 */
function dedent(literals, ...interpolations) {
  const text = Array.isArray(literals) ? indent(literals, ...interpolations) : literals

  // 公共的前导空白
  let commonLeadingWhitespace
  // 第一个非空行
  let firstLineIndex
  // 最后一个非空行
  let lastLineIndex

  const lines = text.split(/[\r\n]/g)

  for (let index = 0; index < lines.length; index++) {
    // 当前行的前导空白
    const leadingWhitespace = lines[index].match(/^\s*/)[0]
    // 如果当前行的前导空白等于当前行的长度，则认为这是一个空行，跳过
    if (leadingWhitespace.length !== lines[index].length) {
      lastLineIndex = index
      if (firstLineIndex == null) {
        firstLineIndex = index
      }
      if (
        commonLeadingWhitespace == null ||
        leadingWhitespace.length < commonLeadingWhitespace.length
      ) {
        commonLeadingWhitespace = leadingWhitespace
      }
    }
  }

  return commonLeadingWhitespace == null
    ? text
    : lines
        .slice(firstLineIndex, lastLineIndex + 1)
        .map((line) => line.substr(commonLeadingWhitespace.length))
        .join('\n')
}

/**
 * 等待一段时间 resolve。
 *
 * @public
 * @param milliseconds 等待时间(毫秒)
 * @param value resolve 值
 * @example
 * ```typescript
 * wait(1000).then(() => {
 *   console.log('ok')
 * }) // => 1秒后在控制台打印字符串: ok
 * ```
 */
function wait(milliseconds, value) {
  let timer
  const result = new Promise((resolve) => {
    timer = setTimeout(() => resolve(value), milliseconds)
  })
  result.cancel = () => clearTimeout(timer)
  return result
}

/**
 * 等待一段时间后 reject。
 *
 * @public
 * @param milliseconds 等待时间(毫秒)
 * @param value reject 值
 * @example
 * ```typescript
 * wait.reject(1000).catch(() => {
 *   console.log('ok')
 * }) // => 1秒后在控制台打印字符串: ok
 * ```
 */
wait.reject = function reject(milliseconds, value) {
  const waitRes = wait(milliseconds)
  const res = waitRes.then(() => Promise.reject(value))
  res.cancel = waitRes.cancel
  return res
}

/**
 * 遍历对象和数组。
 *
 * @param value 要遍历的值
 * @param callback 遍历回调
 * @returns 返回结果
 * @example
 * ```typescript
 * traverse([1, 2, {3: 4}], value => {
 *   console.log(value)
 *   // => 1
 *   // => 2
 *   // => {3: 4}
 *   // => 4
 * })
 * ```
 */
function traverse(value, callback) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      callback(item, index, value)
      if (value[index] !== undefined) {
        traverse(item, callback)
      }
    })
  } else if (_.isPlainObject(value)) {
    _.forOwn(value, (item, key) => {
      callback(item, key, value)
      if (_.has(value, key)) {
        traverse(item, callback)
      }
    })
  }
}
module.exports = {
  getResponseDataJsonSchema,
  getRequestDataJsonSchema,
  jsonSchemaToType,
  indent,
  dedent,
  wait,
  getHttpJson,
}

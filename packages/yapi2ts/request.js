const axios = require('axios')
const _ = require('lodash')

const fetchApi = async (url, query) => {
  const res = await axios.get(url, query)
  /* istanbul ignore next */
  if (res && res.errcode) {
    throw new Error(res.errmsg.join(''))
  }
  return res.data || res
}

const getProjectInfo = async ({ serverUrl, token }) => {
  const projectInfo = await fetchApi(`${serverUrl}/api/project/get?token=${token}`)
  const basePath = `/${projectInfo.basepath || '/'}`.replace(/\/+$/, '').replace(/^\/+/, '/')
  projectInfo.basepath = basePath
  // 实现项目在 YApi 上的地址
  projectInfo._url = `${serverUrl}/project/${projectInfo._id}/interface/api`
  return projectInfo
}

const getCategoryList = async ({ serverUrl, token }) => {
  const projectInfo = await getProjectInfo({ serverUrl, token })
  const categoryList = await fetchApi(
    `${serverUrl}/api/plugin/export?type=json&status=all&isWiki=false&token=${token}`
  )

  return categoryList.map((cat) => {
    const projectId = cat.list?.[0]?.project_id || 0
    const catId = cat.list?.[0]?.catid || 0
    // 实现分类在 YApi 上的地址
    cat._url = `${serverUrl}/project/${projectId}/interface/api/cat_${catId}`
    cat.catId = catId
    cat.projectId = projectId
    cat.list = (cat.list || []).map((item) => {
      const interfaceId = item._id
      // 实现接口在 YApi 上的地址
      item._url = `${serverUrl}/project/${projectId}/interface/api/${interfaceId}`
      item.path = `${projectInfo.basepath}${item.path}`
      return item
    })
    return cat
  })
}

module.exports = {
  getProjectInfo,
  getCategoryList,
}

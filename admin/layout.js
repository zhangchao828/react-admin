/**
 * 默认的admin，在没有自己创建admin/index时使用，默认直接返回对应页面
 * 当children为null的时候表示路由没有匹配到 (404)
 */
export default ({ children }) => children

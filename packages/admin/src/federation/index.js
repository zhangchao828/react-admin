import { memo, Suspense } from 'react'
import { getQuery, history } from '../router'
import federationApps from '~admin/federation-apps'

function Federation(props) {
  const query = getQuery()
  const { name, path = '/', fallback, ...rest } = props
  const App = federationApps[name]
  if (App) {
    return (
      <Suspense fallback={fallback || null}>
        <App query={query} pathname={path} history={history} {...rest} federation />
      </Suspense>
    )
  }
  console.error(`模块联邦应用：${name} 未注册`)
  return null
}
export default memo(Federation)

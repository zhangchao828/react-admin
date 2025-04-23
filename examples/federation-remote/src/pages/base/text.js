import { observer } from '@zswl/admin'

function Index({ props: { children } }) {
  return <span>{children}</span>
}

export default observer(Index)

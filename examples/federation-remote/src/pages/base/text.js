import { observer } from '@glcc/admin'

function Index({ props: { children } }) {
  return <span>{children}</span>
}

export default observer(Index)

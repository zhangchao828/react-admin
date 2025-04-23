import { observer } from '@zswl/admin'
import { Input } from 'antd'

function Index({ props: { value, onChange } }) {
  return <Input value={value} onChange={onChange} />
}

export default observer(Index)

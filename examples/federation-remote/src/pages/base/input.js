import { observer } from '@glcc/admin'
import { Input } from 'antd'

function Index({ props: { value, onChange } }) {
  return <Input value={value} onChange={onChange} />
}

export default observer(Index)

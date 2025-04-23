import { observer, history } from '@glcc/admin'
import { Button } from 'antd'

function Index(props) {
  console.log('button', props)
  return (
    <Button
      onClick={() => {
        history.push('/base/input')
      }}
      {...props}
    >
      按钮
    </Button>
  )
}

export default observer(Index)

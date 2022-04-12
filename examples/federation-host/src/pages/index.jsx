import { Remote } from '@zc/admin'

export default function Index() {
  return (
    <div>
      host index page
      <Remote name="remote" path="/detail/11" />
    </div>
  )
}

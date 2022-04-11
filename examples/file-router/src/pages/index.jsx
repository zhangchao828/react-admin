import { getAppContext } from '@zc/admin'

export default function Index() {
  console.log(getAppContext())
  return <div>Index page</div>
}

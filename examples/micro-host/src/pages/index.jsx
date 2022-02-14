import { Remote } from 'm100'

export default function Index() {
  return (
    <div>
      host index page
      <Remote name="remote" path="/detail/11" />
    </div>
  )
}

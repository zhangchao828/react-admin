import { observer, Remote } from '@glcc/admin'

function Index({ props: { children, title, actions } }) {
  return (
    <div>
      <div>page</div>
      <h1>{title}</h1>
      <div>{actions}</div>
      {/*<Remote pathname="/home1" />*/}
      {children}
    </div>
  )
}

export default observer(Index)

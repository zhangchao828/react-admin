import { history } from '@glcc/admin'

export default function Detail(props) {
  return (
    <div>
      remote Detail{props.params?.id}
      <br />
      <br />
      <a
        onClick={() => {
          history.push('/')
        }}
      >
        home
      </a>
    </div>
  )
}

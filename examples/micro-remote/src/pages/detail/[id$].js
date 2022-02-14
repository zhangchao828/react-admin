export default function Detail(props) {
  console.log(props)
  return <div>remote Detail{props.params?.id}</div>
}

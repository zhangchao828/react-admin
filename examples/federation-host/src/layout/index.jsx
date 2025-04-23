// import { Test } from 'remoteTest/components'
/* eslint-disable */
const DevLayout = require(`./${process.env.NODE_ENV}`)

export default function Layout(props) {
  return <DevLayout.default {...props} />
}

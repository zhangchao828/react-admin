import { Component } from 'react'
import test from './add'

export default class Home extends Component {
  state = {
    name: 'Home',
  }
  render() {
    test()
    return <div>{this.state.name}</div>
  }
}

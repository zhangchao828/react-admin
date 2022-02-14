import { Component } from 'react'

export default class Home extends Component {
  state = {
    name: 'Home',
  }
  render() {
    return <div>{this.state.name}</div>
  }
}

import React, { PureComponent } from 'react'
import { Form } from 'antd'
import { FormComponentProps } from 'antd/es/form'

const { Item } = Form
interface SearchBarProps extends FormComponentProps {}

class SearchBar extends PureComponent<SearchBarProps> {
  render() {
    const { children, form } = this.props
    return children
  }
}
export default Form.create<SearchBarProps>()(SearchBar)

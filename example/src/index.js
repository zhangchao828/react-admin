import React from 'react'
import { HashRouter } from 'react-router-dom'

export default function({ children }) {
  return (
    <HashRouter>{children}</HashRouter>
  )
}

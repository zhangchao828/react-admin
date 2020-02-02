import { setConfig } from 'react-hot-loader'
import React from 'react'
import { render } from 'react-dom'
import App from './App'

const id = 'app'
let appDom = document.getElementById(id)
if (!appDom) {
  appDom = document.createElement('div')
  appDom.id = id
  document.body.appendChild(appDom)
}

setConfig({ showReactDomPatchNotification: false })
render(<App />, appDom)

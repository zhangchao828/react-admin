import { makeAutoObservable as _makeAutoObservable } from 'mobx'

export { flow, configure, toJS } from 'mobx'
export { observer } from 'mobx-react-lite'

export function makeAutoObservable(target, overrides, options) {
  return _makeAutoObservable(target, overrides, { autoBind: true, ...options })
}

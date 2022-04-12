import { configure } from 'mobx'

configure({
  useProxies: 'ifavailable',
  enforceActions: 'observed',
})
export { observable, computed, action, runInAction, makeObservable, makeAutoObservable } from 'mobx'
export { observer } from 'mobx-react-lite'

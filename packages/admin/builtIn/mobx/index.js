import { configure } from 'mobx'

configure({
  useProxies: 'always',
  enforceActions: 'observed',
})
export {
  observable,
  computed,
  action,
  flow,
  runInAction,
  makeObservable,
  makeAutoObservable,
} from 'mobx'
export { observer } from 'mobx-react-lite'

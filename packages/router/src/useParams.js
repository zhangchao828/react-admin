import { useAppContext } from '@zc/admin'
import { useParams as _useParams } from 'react-router-dom'

export default function useParams() {
  const { params } = useAppContext()
  const _params = _useParams()
  return params ?? _params
}

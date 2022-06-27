import { FC } from 'react'

export interface FederationProps {
  path: string
  name: string
  fallback?: any
  [propName: string]: any
}
declare const Remote: FC<FederationProps>

export default Remote

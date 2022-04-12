import { FC } from 'react'

export interface RemoteProps {
  path?: string
  name: string
  [propName: string]: any
}
declare const Remote: FC<RemoteProps>

export default Remote

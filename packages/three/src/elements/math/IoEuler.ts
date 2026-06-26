import { Register, Property, Field } from '@io-gui/core'
import { Euler } from 'three/webgpu'
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js'

export type IoEulerProps = IoVectorBaseProps & {
  value?: Euler
}

@Register
export class IoEuler extends IoVectorBase {

  @Property({type: Euler, init: null})
  declare value: Euler

  @Field(['x', 'y', 'z'])
  declare keys: Array<string>

  constructor(args: IoEulerProps) {
    super(args)
  }

}
export const ioEuler = function(arg0?: IoEulerProps) {
  return IoEuler.vConstructor(arg0)
}
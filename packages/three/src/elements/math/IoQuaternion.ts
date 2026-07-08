import { Register, Property, Field } from '@io-gui/core'
import { Quaternion } from 'three/webgpu'
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js'

export type IoQuaternionProps = IoVectorBaseProps & {
  value?: Quaternion
}

@Register
export class IoQuaternion extends IoVectorBase {

  @Property({type: Quaternion, init: null})
  declare value: Quaternion

  @Field(['x', 'y', 'z', 'w'])
  declare keys: Array<string>

  constructor(args: IoQuaternionProps) {
    super(args)
  }

}
export const ioQuaternion = function(arg0?: IoQuaternionProps) {
  return IoQuaternion.vConstructor(arg0)
}
import { Register, ReactiveProperty, Property } from '@io-gui/core'
import { Vector3 } from 'three/webgpu'
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js'

export type IoVector3Props = IoVectorBaseProps & {
  value?: Vector3
}

@Register
export class IoVector3 extends IoVectorBase {

  @ReactiveProperty({type: Vector3, init: null})
  declare value: Vector3

  @Property(['x', 'y', 'z'])
  declare keys: Array<string>

  constructor(args: IoVector3Props) {
    super(args)
  }

}
export const ioVector3 = function(arg0?: IoVector3Props) {
  return IoVector3.vConstructor(arg0)
}
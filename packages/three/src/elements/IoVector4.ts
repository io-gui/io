import { Register, ReactiveProperty, Property } from '@io-gui/core'
import { Vector4 } from 'three/webgpu'
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js'

export type IoVector4Props = IoVectorBaseProps & {
  value?: Vector4
}

@Register
export class IoVector4 extends IoVectorBase {

  @ReactiveProperty({type: Vector4, init: null})
  declare value: Vector4

  @Property(['x', 'y', 'z', 'w'])
  declare keys: Array<string>

  constructor(args: IoVector4Props) {
    super(args)
  }

}
export const ioVector4 = function(arg0?: IoVector4Props) {
  return IoVector4.vConstructor(arg0)
}
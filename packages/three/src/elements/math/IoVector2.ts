import { Register, Property, Field } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js'

export type IoVector2Props = IoVectorBaseProps & {
  value?: Vector2
}

@Register
export class IoVector2 extends IoVectorBase {

  @Property({type: Vector2, init: null})
  declare value: Vector2

  @Field(['x', 'y'])
  declare keys: Array<string>

  constructor(args: IoVector2Props) {
    super(args)
  }

}
export const ioVector2 = function(arg0?: IoVector2Props) {
  return IoVector2.vConstructor(arg0)
}
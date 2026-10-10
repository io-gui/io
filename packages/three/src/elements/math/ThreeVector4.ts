import { Register, Property, Field } from '@io-gui/core'
import { Vector4 } from 'three/webgpu'
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js'

export type ThreeVector4Props = ThreeVectorBaseProps & {
  value?: Vector4
}

@Register
export class ThreeVector4 extends ThreeVectorBase {

  @Property({type: Vector4, init: null})
  declare value: Vector4

  @Field(['x', 'y', 'z', 'w'])
  declare keys: Array<string>

  constructor(args: ThreeVector4Props) {
    super(args)
  }

}
export const threeVector4 = function(arg0?: ThreeVector4Props) {
  return ThreeVector4.vConstructor(arg0)
}
import { Register, Property, Field } from '@io-gui/core'
import { Quaternion } from 'three/webgpu'
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js'

export type ThreeQuaternionProps = ThreeVectorBaseProps & {
  value?: Quaternion
}

@Register
export class ThreeQuaternion extends ThreeVectorBase {

  @Property({type: Quaternion, init: null})
  declare value: Quaternion

  @Field(['x', 'y', 'z', 'w'])
  declare keys: Array<string>

  constructor(args: ThreeQuaternionProps) {
    super(args)
  }

}
export const threeQuaternion = function(arg0?: ThreeQuaternionProps) {
  return ThreeQuaternion.vConstructor(arg0)
}
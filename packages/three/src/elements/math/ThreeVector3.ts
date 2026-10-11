import { Register, Property, Field } from '@io-gui/core'
import { Vector3 } from 'three/webgpu'
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js'

export type ThreeVector3Props = ThreeVectorBaseProps & {
  value?: Vector3
}

@Register
export class ThreeVector3 extends ThreeVectorBase {

  @Property({type: Vector3, init: null})
  declare value: Vector3

  @Field(['x', 'y', 'z'])
  declare keys: Array<string>

  constructor(args: ThreeVector3Props) {
    super(args)
  }

}
export const threeVector3 = function(arg0?: ThreeVector3Props) {
  return ThreeVector3.vConstructor(arg0)
}
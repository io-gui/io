import { Register, Property, Field } from '@io-gui/core'
import { Vector2 } from 'three/webgpu'
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js'

export type ThreeVector2Props = ThreeVectorBaseProps & {
  value?: Vector2
}

@Register
export class ThreeVector2 extends ThreeVectorBase {

  @Property({type: Vector2, init: null})
  declare value: Vector2

  @Field(['x', 'y'])
  declare keys: Array<string>

  constructor(args: ThreeVector2Props) {
    super(args)
  }

}
export const threeVector2 = function(arg0?: ThreeVector2Props) {
  return ThreeVector2.vConstructor(arg0)
}
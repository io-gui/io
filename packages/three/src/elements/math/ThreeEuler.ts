import { Register, Property, Field } from '@io-gui/core'
import { Euler } from 'three/webgpu'
import { ThreeVectorBaseProps, ThreeVectorBase } from './ThreeVectorBase.js'

export type ThreeEulerProps = ThreeVectorBaseProps & {
  value?: Euler
}

@Register
export class ThreeEuler extends ThreeVectorBase {

  @Property({type: Euler, init: null})
  declare value: Euler

  @Field(['x', 'y', 'z'])
  declare keys: Array<string>

  constructor(args: ThreeEulerProps) {
    super(args)
  }

}
export const threeEuler = function(arg0?: ThreeEulerProps) {
  return ThreeEuler.vConstructor(arg0)
}
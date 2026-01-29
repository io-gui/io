import { Register, ReactiveProperty, Property } from '@io-gui/core'
import { Euler } from 'three/webgpu'
import { IoVectorBaseProps, IoVectorBase } from './IoVectorBase.js'

export type IoEulerProps = IoVectorBaseProps & {
  value?: Euler
}

@Register
export class IoEuler extends IoVectorBase {

  @ReactiveProperty({type: Euler, init: null})
  declare value: Euler

  @Property(['x', 'y', 'z'])
  declare keys: Array<string>

  constructor(args: IoEulerProps) {
    super(args)
  }

}
export const ioEuler = function(arg0?: IoEulerProps) {
  return IoEuler.vConstructor(arg0)
}
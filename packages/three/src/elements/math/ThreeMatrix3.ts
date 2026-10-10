import { Register } from '@io-gui/core'
import { ThreeMatrixBase, ThreeMatrixBaseProps } from './ThreeMatrixBase.js'

export type ThreeMatrix3Props = ThreeMatrixBaseProps & {
  value?: number[]
}

@Register
export class ThreeMatrix3 extends ThreeMatrixBase {
  static override get Style() {
    return /* css */`
      :host {
        grid-template-columns: repeat(3, 1fr);
      }
    `
  }
}

export const threeMatrix3 = function(arg0?: ThreeMatrix3Props) {
  return ThreeMatrix3.vConstructor(arg0)
}
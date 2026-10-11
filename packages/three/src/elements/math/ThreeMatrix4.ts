import { Register } from '@io-gui/core'
import { ThreeMatrixBase, ThreeMatrixBaseProps } from './ThreeMatrixBase.js'

export type ThreeMatrix4Props = ThreeMatrixBaseProps & {
  value?: number[]
}

@Register
export class ThreeMatrix4 extends ThreeMatrixBase {
  static override get Style() {
    return /* css */`
      :host {
        grid-template-columns: repeat(4, 1fr);
      }
    `
  }
}

export const threeMatrix4 = function(arg0?: ThreeMatrix4Props) {
  return ThreeMatrix4.vConstructor(arg0)
}
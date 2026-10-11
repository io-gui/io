import { Register } from '@io-gui/core'
import { ThreeMatrixBase, ThreeMatrixBaseProps } from './ThreeMatrixBase.js'

export type ThreeMatrix2Props = ThreeMatrixBaseProps & {
  value?: number[]
}

@Register
export class ThreeMatrix2 extends ThreeMatrixBase {
  static override get Style() {
    return /* css */`
      :host {
        grid-template-columns: repeat(2, 1fr);
      }
    `
  }
}

export const threeMatrix2 = function(arg0?: ThreeMatrix2Props) {
  return ThreeMatrix2.vConstructor(arg0)
}
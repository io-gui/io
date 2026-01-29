import { Property, Register } from '@io-gui/core'
import { IoMatrixBase, IoMatrixBaseProps } from './IoMatrixBase.js'

export type IoMatrix2Props = IoMatrixBaseProps & {
  value?: number[]
}

@Register
export class IoMatrix2 extends IoMatrixBase {
  static get Style() {
    return /* css */`
      :host {
        grid-template-columns: repeat(2, 1fr);
      }
    `
  }
  @Property([0, 1, 2, 3])
  declare keys: number[]
}

export const ioMatrix2 = function(arg0?: IoMatrix2Props) {
  return IoMatrix2.vConstructor(arg0)
}
import { Property, Register } from '@io-gui/core'
import { IoMatrixBase, IoMatrixBaseProps } from './IoMatrixBase.js'

export type IoMatrix4Props = IoMatrixBaseProps & {
  value?: number[]
}

@Register
export class IoMatrix4 extends IoMatrixBase {
  static get Style() {
    return /* css */`
      :host {
        grid-template-columns: repeat(4, 1fr);
      }
    `
  }
  @Property([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])
  declare keys: number[]
}

export const ioMatrix4 = function(arg0?: IoMatrix4Props) {
  return IoMatrix4.vConstructor(arg0)
}
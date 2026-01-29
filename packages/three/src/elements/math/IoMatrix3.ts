import { Register } from '@io-gui/core'
import { IoMatrixBase, IoMatrixBaseProps } from './IoMatrixBase.js'

export type IoMatrix3Props = IoMatrixBaseProps & {
  value?: number[]
}

@Register
export class IoMatrix3 extends IoMatrixBase {
  static get Style() {
    return /* css */`
      :host {
        grid-template-columns: repeat(3, 1fr);
      }
    `
  }
}

export const ioMatrix3 = function(arg0?: IoMatrix3Props) {
  return IoMatrix3.vConstructor(arg0)
}
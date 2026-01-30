import { Register } from '@io-gui/core'
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
}

export const ioMatrix4 = function(arg0?: IoMatrix4Props) {
  return IoMatrix4.vConstructor(arg0)
}
//@ts-nocheck
import { Register, IoElement } from 'io-core'

export class IoThreeDemo extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
      }
    `
  }
  ready() {}
}
Register(IoThreeDemo)
export const ioThreeDemo = IoThreeDemo.vConstructor

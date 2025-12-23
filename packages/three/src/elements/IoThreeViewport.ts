import { Register, IoElement, IoElementProps } from 'io-core'

export type IoThreeViewportProps = IoElementProps & {
}

@Register
export class IoThreeViewport extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
      }
    `
  }

  constructor(args: IoThreeViewportProps = {}) { super(args) }
}

import { Register, IoElement, ReactiveProperty } from '@io-gui/core'
import { ioThreeViewport } from '@io-gui/three'
import { ThreeApplet } from '../nodes/ThreeApplet.js'

export class IoThreeExample extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
      }
      :host .property-editor {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
      }
      :host .property-editor > io-property-editor {
        position: absolute;
        min-width: 240px;
        top: 0;
        right: 0;
      }
    `
  }

  @ReactiveProperty({type: ThreeApplet, init: null})
  declare applet: ThreeApplet

  ready() {

    this.render([
      ioThreeViewport({applet: this.applet, cameraSelect: 'perspective'}),
    ])

  }

  dispose() {
    this.applet.dispose()
    super.dispose()
  }
}

Register(IoThreeExample)
export const ioThreeExample = IoThreeExample.vConstructor

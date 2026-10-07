import { Register, ReactiveElement, Property } from '@io-gui/core'
import { ioThreeViewport } from '@io-gui/three'
import { ThreeEditor } from '../editor/ThreeEditor.js'

export class IoThreeExample extends ReactiveElement {
  static override get Style() {
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

  @Property({type: ThreeEditor, init: null})
  declare editor: ThreeEditor

  override ready() {

    this.render([
      ioThreeViewport({editor: this.editor, cameraSelect: 'perspective'}),
    ])

  }

  override dispose() {
    this.editor.dispose()
    super.dispose()
  }
}

Register(IoThreeExample)
export const ioThreeExample = (arg0: any) => IoThreeExample.vConstructor(arg0)

import { Register, IoElement, IoElementProps, ReactiveProperty, WithBinding } from '@io-gui/core'
import { ioPropertyEditor } from '@io-gui/editors'
import { ThreeApplet } from '../nodes/ThreeApplet.js'
import './Three.js'

export type IoThreePropertiesProps = IoElementProps & {
  applet: WithBinding<ThreeApplet>
}

@Register
export class IoThreeProperties extends IoElement {

  @ReactiveProperty({type: ThreeApplet, init: null})
  declare applet: ThreeApplet

  static get Style() {
    return /* css */`
      :host {
        position: relative;
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        max-width: 100%;
        max-height: 100%;
      }
      :host > io-property-editor {
        width: 100%;
        position: absolute;
      }
    `
  }

  constructor(args: IoThreePropertiesProps) {
    super(args)
  }

  changed() {
    this.render([
      ioPropertyEditor({
        value: this.applet,
        config: this.applet.uiConfig,
        groups: this.applet.uiGroups,
      })
    ])
  }
}

export const ioThreeProperties = function(arg0: IoThreePropertiesProps) {
  return IoThreeProperties.vConstructor(arg0)
}
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { ioThreeViewport } from '@io-gui/three';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
export class IoThreeExample extends IoElement {
    static get Style() {
        return /* css */ `
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
    `;
    }
    ready() {
        this.render([
            ioThreeViewport({ applet: this.applet, cameraSelect: 'perspective' }),
        ]);
    }
    dispose() {
        this.applet.dispose();
        super.dispose();
    }
}
__decorate([
    ReactiveProperty({ type: ThreeApplet, init: null })
], IoThreeExample.prototype, "applet", void 0);
Register(IoThreeExample);
export const ioThreeExample = IoThreeExample.vConstructor;
//# sourceMappingURL=IoThreeExample.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { ioPropertyEditor } from '@io-gui/editors';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import '../nodes/ThreeEditorConfig.js';
let IoThreeProperties = class IoThreeProperties extends IoElement {
    static get Style() {
        return /* css */ `
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
    `;
    }
    constructor(args) {
        super(args);
    }
    changed() {
        this.render([
            ioPropertyEditor({ value: this.applet, config: this.applet.uiConfig })
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: ThreeApplet, init: null })
], IoThreeProperties.prototype, "applet", void 0);
IoThreeProperties = __decorate([
    Register
], IoThreeProperties);
export { IoThreeProperties };
export const ioThreeProperties = function (arg0) {
    return IoThreeProperties.vConstructor(arg0);
};
//# sourceMappingURL=IoThreeProperties.js.map
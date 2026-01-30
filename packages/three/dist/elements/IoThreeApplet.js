var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { ioSplit, Split } from '@io-gui/layout';
import { ioThreeViewport } from '@io-gui/three';
import { ioPropertyEditor } from '@io-gui/editors';
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
            ioSplit({
                elements: [
                    ioThreeViewport({ id: 'Top', applet: this.applet, playing: true, cameraSelect: 'top' }),
                    ioThreeViewport({ id: 'Left', applet: this.applet, playing: true, cameraSelect: 'left' }),
                    ioThreeViewport({ id: 'Perspective', applet: this.applet, playing: true, cameraSelect: 'perspective' }),
                    ioThreeViewport({ id: 'SceneCamera', applet: this.applet, playing: true, cameraSelect: 'scene' }),
                    ioPropertyEditor({ id: 'PropertyEditor', value: this.applet, config: this.uiConfig, groups: this.uiGroups })
                ],
                split: new Split({
                    type: 'split',
                    orientation: 'horizontal',
                    children: [
                        {
                            type: 'split',
                            flex: '2 1 auto',
                            orientation: 'vertical',
                            children: [
                                {
                                    type: 'split',
                                    flex: '1 1 50%',
                                    orientation: 'horizontal',
                                    children: [
                                        { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'Top' }] },
                                        { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'Left' }] }
                                    ]
                                },
                                {
                                    type: 'split',
                                    flex: '1 1 50%',
                                    orientation: 'horizontal',
                                    children: [
                                        { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'Perspective' }] },
                                        { type: 'panel', flex: '1 1 50%', tabs: [{ id: 'SceneCamera' }] },
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'panel',
                            flex: '0 0 220px',
                            tabs: [{ id: 'PropertyEditor' }]
                        }
                    ]
                })
            })
        ]);
    }
}
__decorate([
    ReactiveProperty({ type: Array, init: null })
], IoThreeExample.prototype, "uiConfig", void 0);
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoThreeExample.prototype, "uiGroups", void 0);
__decorate([
    ReactiveProperty({ type: ThreeApplet, init: null })
], IoThreeExample.prototype, "applet", void 0);
Register(IoThreeExample);
export const ioThreeExample = IoThreeExample.vConstructor;
//# sourceMappingURL=IoThreeApplet.js.map
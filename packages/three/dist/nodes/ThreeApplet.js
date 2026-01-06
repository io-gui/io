var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Node, ReactiveProperty } from '@io-gui/core';
import { ioNumberSlider } from '@io-gui/sliders';
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene } from 'three/webgpu';
import { ioOptionSelect, MenuOption } from '@io-gui/menus';
let ThreeApplet = class ThreeApplet extends Node {
    _renderer = null;
    _width = 0;
    _height = 0;
    _prevTime = -1;
    constructor(args) {
        super(args);
    }
    updateViewportSize(width, height) {
        if (this._width !== width || this._height !== height) {
            if (!!width && !!height) {
                this._width = width;
                this._height = height;
                this.onResized(width, height);
            }
        }
    }
    isRendererInitialized() {
        return !!this._renderer && this._renderer.initialized === true;
    }
    onRendererInitialized(renderer) {
        this._renderer = renderer;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResized(width, height) { }
    animate(time, delta) {
        if (this._prevTime === time)
            return;
        this._prevTime = time;
        this.onAnimate(delta);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAnimate(delta) { }
};
__decorate([
    ReactiveProperty({ type: Scene, init: null })
], ThreeApplet.prototype, "scene", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 1 })
], ThreeApplet.prototype, "toneMappingExposure", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: NoToneMapping })
], ThreeApplet.prototype, "toneMapping", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: null })
], ThreeApplet.prototype, "uiConfig", void 0);
__decorate([
    ReactiveProperty({ type: Object, init: null })
], ThreeApplet.prototype, "uiGroups", void 0);
ThreeApplet = __decorate([
    Register
], ThreeApplet);
export { ThreeApplet };
registerEditorConfig(ThreeApplet, [
    ['toneMappingExposure', ioNumberSlider({ min: 0, max: 3, step: 0.01, exponent: 2 })],
    ['toneMapping', ioOptionSelect({ option: new MenuOption({ options: [
                    { value: NoToneMapping, id: 'NoToneMapping' },
                    { value: LinearToneMapping, id: 'LinearToneMapping' },
                    { value: ReinhardToneMapping, id: 'ReinhardToneMapping' },
                    { value: CineonToneMapping, id: 'CineonToneMapping' },
                    { value: ACESFilmicToneMapping, id: 'ACESFilmicToneMapping' },
                    // {value: CustomToneMapping, id: 'CustomToneMapping'},
                    { value: AgXToneMapping, id: 'AgXToneMapping' },
                    { value: NeutralToneMapping, id: 'NeutralToneMapping' },
                ] }) })],
]);
registerEditorGroups(ThreeApplet, {
    Main: [
        'scene',
    ],
    Rendering: [
        'toneMappingExposure',
        'toneMapping',
    ],
    Hidden: [
        'uiConfig',
        'uiGroups',
    ],
    Advanced: []
});
//# sourceMappingURL=ThreeApplet.js.map
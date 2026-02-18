var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveNode, ReactiveProperty } from '@io-gui/core';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, Timer, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene } from 'three/webgpu';
import { ioOptionSelect, MenuOption } from '@io-gui/menus';
const _playingApplets = [];
function rAFLoop() {
    for (const applet of _playingApplets) {
        applet.onRAF();
    }
    requestAnimationFrame(rAFLoop);
}
rAFLoop();
let ThreeApplet = class ThreeApplet extends ReactiveNode {
    _renderer = null;
    _width = 0;
    _height = 0;
    _timer = new Timer();
    constructor(args) {
        super(args);
        this._timer.connect(document);
        this.isPlayingChanged();
    }
    isPlayingChanged() {
        if (this.isPlaying === true && _playingApplets.includes(this) === false) {
            _playingApplets.push(this);
        }
        else if (this.isPlaying === false && _playingApplets.includes(this)) {
            _playingApplets.splice(_playingApplets.indexOf(this), 1);
        }
    }
    onRAF() {
        if (!this.isPlaying)
            return;
        this._timer.update();
        const delta = this._timer.getDelta();
        const time = this._timer.getElapsed();
        this.onAnimate(delta, time);
        this.dispatch('three-applet-needs-render', undefined, true);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAnimate(delta, time) { }
    dispose() {
        this.isPlaying = false;
        super.dispose();
        // this._timer.disconnect();
    }
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
    ReactiveProperty({ type: Boolean, value: false })
], ThreeApplet.prototype, "isPlaying", void 0);
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
                    { value: AgXToneMapping, id: 'AgXToneMapping' },
                    { value: NeutralToneMapping, id: 'NeutralToneMapping' },
                ] }) })],
    ['scene', ioPropertyEditor({ properties: ['children'], label: '_hidden_' })],
]);
registerEditorGroups(ThreeApplet, {
    Main: [
        'scene',
    ],
    Hidden: [
        'isPlaying',
        'toneMapping',
        'toneMappingExposure',
        '_renderer',
        '_width',
        '_height',
        '_timer',
    ],
});
//# sourceMappingURL=ThreeApplet.js.map
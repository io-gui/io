var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene } from 'three/webgpu';
import { ioOptionSelect, Menu } from '@io-gui/menus';
import { ChangeBus } from '../editor/ChangeBus.js';
import { renderScheduler } from '../render/RenderScheduler.js';
let ThreeApplet = class ThreeApplet extends ReactiveObject {
    _renderer = null;
    /** Changes drained by the RenderScheduler each frame; views showing this applet redraw. */
    changeBus = new ChangeBus();
    constructor(args) {
        super(args);
        this.isPlayingChanged();
    }
    isPlayingChanged() {
        if (this.isPlaying) {
            renderScheduler.addTicker(this);
        }
        else {
            renderScheduler.removeTicker(this);
        }
    }
    tick(frame) {
        if (!this.isPlaying)
            return;
        this.onAnimate(frame.delta, frame.time);
        this.notify({ kind: 'time', source: this });
    }
    notify(change) {
        this.changeBus.notify(change);
    }
    /** Redraws every view showing this applet on the next frame. */
    requestRender() {
        this.notify({ kind: 'other', source: this });
    }
    isRendererInitialized() {
        return !!this._renderer && this._renderer.initialized === true;
    }
    onRendererInitialized(renderer) {
        this._renderer = renderer;
    }
    /**
     * @deprecated Size belongs to each view (ADR-0002). Called when a viewport showing this applet resizes;
     * with several viewports, the last one resized wins.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onResized(width, height, viewport) { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onAnimate(delta, time) { }
    dispose() {
        this.isPlaying = false;
        renderScheduler.removeTicker(this);
        super.dispose();
    }
};
__decorate([
    Property({ type: Scene, init: null })
], ThreeApplet.prototype, "scene", void 0);
__decorate([
    Property({ type: Number, value: 1 })
], ThreeApplet.prototype, "toneMappingExposure", void 0);
__decorate([
    Property({ type: Number, value: NoToneMapping })
], ThreeApplet.prototype, "toneMapping", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], ThreeApplet.prototype, "isPlaying", void 0);
ThreeApplet = __decorate([
    Register
], ThreeApplet);
export { ThreeApplet };
registerEditorConfig(ThreeApplet, [
    ['toneMappingExposure', ioNumberSlider({ min: 0, max: 3, step: 0.01, exponent: 2 })],
    ['toneMapping', ioOptionSelect({ model: new Menu({ options: [
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
        'changeBus',
    ],
});

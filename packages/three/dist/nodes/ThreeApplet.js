var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property } from '@io-gui/core';
import { ioNumberSlider } from '@io-gui/sliders';
import { ioPropertyEditor, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ACESFilmicToneMapping, AgXToneMapping, CineonToneMapping, LinearToneMapping, NeutralToneMapping, NoToneMapping, ReinhardToneMapping, Scene } from 'three/webgpu';
import { ioOptionSelect, Menu } from '@io-gui/menus';
import { ThreeEditor } from '../editor/ThreeEditor.js';
import { ThreeDocument } from '../editor/ThreeDocument.js';
/**
 * Compatibility shim (ADR-0002): a ThreeEditor with one document whose `scene`, `toneMapping` and
 * `toneMappingExposure` are two-way bound to the applet's own properties. New apps use ThreeEditor
 * and ThreeDocument directly. After replacing `applet.document`, the applet properties no longer follow it.
 */
let ThreeApplet = class ThreeApplet extends ThreeEditor {
    constructor(args) {
        super({ ...args, document: args?.document ?? new ThreeDocument() });
        this.document.scene = this.bind('scene');
        this.document.toneMapping = this.bind('toneMapping');
        this.document.toneMappingExposure = this.bind('toneMappingExposure');
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
        'document',
        'mode',
        'activeTools',
        'operators',
        'tools',
    ],
});

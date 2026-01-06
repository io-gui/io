import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { Spherical } from 'three/webgpu';
registerEditorConfig(Object, [
    [Spherical, ioObject({ labelWidth: '52px', config: [
                ['phi', ioNumberSlider({ min: -2 * Math.PI, max: 2 * Math.PI, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
                ['theta', ioNumberSlider({ min: 0, max: 2 * Math.PI, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
//# sourceMappingURL=Spherical.js.map
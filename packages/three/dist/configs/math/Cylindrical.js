import { registerEditorConfig, ioObject } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { Cylindrical } from 'three/webgpu';
registerEditorConfig(Object, [
    [Cylindrical, ioObject({ labelWidth: '52px', config: [
                ['theta', ioNumberSlider({ min: 0, max: 2 * Math.PI, step: Math.PI / 180, conversion: 1 / Math.PI * 180 })],
            ] })],
]);
//# sourceMappingURL=Cylindrical.js.map
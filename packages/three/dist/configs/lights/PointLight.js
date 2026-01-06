import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumber } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
import { PointLight } from 'three/webgpu';
registerEditorConfig(PointLight, [
    ['distance', ioNumber({ min: 0, step: 0.1 })],
    ['decay', ioNumberSlider({ min: 0, max: 5, step: 0.01 })],
]);
registerEditorGroups(PointLight, {
    Main: ['distance', 'decay', 'power', 'shadow'],
});
//# sourceMappingURL=PointLight.js.map
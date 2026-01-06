import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { ProjectorLight } from 'three/webgpu';
registerEditorConfig(ProjectorLight, [
    ['aspect', ioNumberSlider({ min: 0.1, max: 4, step: 0.01 })],
]);
registerEditorGroups(ProjectorLight, {
    Main: ['aspect'],
});
//# sourceMappingURL=ProjectorLight.js.map
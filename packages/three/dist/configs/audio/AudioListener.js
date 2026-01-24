import { registerEditorConfig, registerEditorGroups, ioObject } from '@io-gui/editors';
import { ioNumberSlider } from '@io-gui/sliders';
import { AudioListener } from 'three/webgpu';
/**
 * AudioListener extends Object3D
 * Virtual listener for all positional and non-positional audio effects
 * Usually attached to the camera
 */
registerEditorConfig(AudioListener, [
    ['timeDelta', ioNumberSlider({ min: 0, max: 1, step: 0.001 })],
]);
registerEditorGroups(AudioListener, {
    Main: ['timeDelta'],
    WebAudio: ['context', 'gain', 'filter'],
});
registerEditorConfig(Object, [
    [AudioListener, ioObject()],
]);
//# sourceMappingURL=AudioListener.js.map
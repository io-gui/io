import { registerEditorConfig, registerEditorGroups, ioObject } from '@io-gui/editors';
import { ioNumber } from '@io-gui/inputs';
import { ioNumberSlider } from '@io-gui/sliders';
import { Audio } from 'three/webgpu';
/**
 * Audio extends Object3D
 * Non-positional (global) audio using Web Audio API
 */
registerEditorConfig(Audio, [
    ['loopStart', ioNumber({ min: 0, max: Infinity, step: 0.01 })],
    ['loopEnd', ioNumber({ min: 0, max: Infinity, step: 0.01 })],
    ['offset', ioNumber({ min: 0, max: Infinity, step: 0.01 })],
    ['duration', ioNumber({ min: 0, max: Infinity, step: 0.01 })],
    ['playbackRate', ioNumberSlider({ min: 0, max: 4, step: 0.01 })],
    ['detune', ioNumberSlider({ min: -1200, max: 1200, step: 1 })],
]);
registerEditorGroups(Audio, {
    Main: [
        'autoplay',
        'isPlaying',
        'hasPlaybackControl',
    ],
    Playback: [
        'playbackRate',
        'detune',
        'loop',
        'loopStart',
        'loopEnd',
    ],
    Timing: [
        'offset',
        'duration',
    ],
    WebAudio: [
        'listener',
        'context',
        'gain',
        'source',
        'sourceType',
        'buffer',
        'filters',
    ],
});
registerEditorConfig(Object, [
    [Audio, ioObject({ label: 'Audio' })],
]);
//# sourceMappingURL=Audio.js.map
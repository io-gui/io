import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumber } from '@io-gui/inputs';
import { Fog } from 'three/webgpu';
registerEditorConfig(Fog, [
    ['near', ioNumber({ min: 0, max: Infinity, step: 0.1 })],
    ['far', ioNumber({ min: 0, max: Infinity, step: 1 })],
]);
registerEditorGroups(Fog, {
    Main: [
        'name',
        'color',
        'near',
        'far',
    ],
});
registerEditorConfig(Object, [
    [Fog, ioObject({ labelWidth: '52px' })],
]);
//# sourceMappingURL=Fog.js.map
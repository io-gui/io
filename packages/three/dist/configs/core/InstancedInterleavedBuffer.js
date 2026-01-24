import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumber, ioSwitch } from '@io-gui/inputs';
import { InstancedInterleavedBuffer } from 'three/webgpu';
registerEditorConfig(InstancedInterleavedBuffer, [
    ['meshPerAttribute', ioNumber({ min: 1, max: 1000, step: 1 })],
    ['needsUpdate', ioSwitch({ label: 'Needs Update', value: false })],
]);
registerEditorGroups(InstancedInterleavedBuffer, {
    Instancing: ['meshPerAttribute'],
});
//# sourceMappingURL=InstancedInterleavedBuffer.js.map
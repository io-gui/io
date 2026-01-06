import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioSwitch } from '@io-gui/inputs';
import { Source } from 'three/webgpu';
registerEditorConfig(Source, [
    ['needsUpdate', ioSwitch({ value: false })],
]);
registerEditorGroups(Source, {
    Advanced: ['version'],
});
//# sourceMappingURL=Source.js.map
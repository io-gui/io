import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioSwitch } from '@io-gui/inputs';
import { PostProcessing } from 'three/webgpu';
registerEditorConfig(PostProcessing, [
    ['needsUpdate', ioSwitch({ value: false })]
]);
registerEditorGroups(PostProcessing, {
    Advanced: [
        'context',
        'needsUpdate',
        'outputColorTransform',
    ],
});
//# sourceMappingURL=PostProcessing.js.map
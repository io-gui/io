import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioSwitch } from '@io-gui/inputs';
import { RenderPipeline } from 'three/webgpu';
registerEditorConfig(RenderPipeline, [
    ['needsUpdate', ioSwitch({ value: false })]
]);
registerEditorGroups(RenderPipeline, {
    Advanced: [
        'context',
        'needsUpdate',
        'outputColorTransform',
    ],
});

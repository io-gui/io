import { registerEditorGroups } from '@io-gui/editors';
import { LinearInterpolant } from 'three/webgpu';
registerEditorGroups(LinearInterpolant, {
    Main: [
        'parameterPositions',
        'sampleValues',
        'resultBuffer',
        'valueSize',
    ],
    Settings: ['settings'],
    Hidden: ['_cachedIndex', 'DefaultSettings_'],
});
//# sourceMappingURL=LinearInterpolant.js.map
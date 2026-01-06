import { registerEditorGroups } from '@io-gui/editors';
import { DiscreteInterpolant } from 'three/webgpu';
registerEditorGroups(DiscreteInterpolant, {
    Main: [
        'parameterPositions',
        'sampleValues',
        'resultBuffer',
        'valueSize',
    ],
    Settings: ['settings'],
    Hidden: ['_cachedIndex', 'DefaultSettings_'],
});
//# sourceMappingURL=DiscreteInterpolant.js.map
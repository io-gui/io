import { registerEditorGroups } from '@io-gui/editors'
import { CubicInterpolant } from 'three/webgpu'

registerEditorGroups(CubicInterpolant, {
  Main: [
    'parameterPositions',
    'sampleValues',
    'resultBuffer',
    'valueSize',
  ],
  Settings: ['settings'],
  Hidden: ['_cachedIndex', 'DefaultSettings_', '_weightPrev', '_offsetPrev', '_weightNext', '_offsetNext'],
})


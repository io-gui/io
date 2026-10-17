import { registerEditorGroups } from '@io-gui/editors'
import { BezierInterpolant } from 'three/webgpu'

registerEditorGroups(BezierInterpolant, {
  Main: [
    'parameterPositions',
    'sampleValues',
    'resultBuffer',
    'valueSize',
    'inTangents',
    'outTangents',
  ],
  Settings: ['settings'],
  Hidden: ['_cachedIndex', 'DefaultSettings_'],
})

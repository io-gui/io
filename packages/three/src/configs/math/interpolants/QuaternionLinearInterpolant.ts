import { registerEditorGroups } from "@io-gui/editors"
import { QuaternionLinearInterpolant } from "three/webgpu"

registerEditorGroups(QuaternionLinearInterpolant, {
  Main: [
    'parameterPositions',
    'sampleValues',
    'resultBuffer',
    'valueSize',
  ],
  Settings: ['settings'],
  Hidden: ['_cachedIndex', 'DefaultSettings_'],
})


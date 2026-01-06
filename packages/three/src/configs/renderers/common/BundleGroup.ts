import { registerEditorConfig } from '@io-gui/editors'
import { ioNumber, ioSwitch } from '@io-gui/inputs'
import { BundleGroup } from 'three/webgpu'

registerEditorConfig(BundleGroup, [
  ['version', ioNumber({disabled: true})],
  ['needsUpdate', ioSwitch({value: false})],
])



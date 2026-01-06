import { registerEditorConfig } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { InspectorBase } from 'three/webgpu'

registerEditorConfig(InspectorBase, [
  ['currentFrame', ioNumber({disabled: true})],
])

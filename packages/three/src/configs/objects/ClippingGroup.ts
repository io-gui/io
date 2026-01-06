import { registerEditorGroups } from '@io-gui/editors'
import { ClippingGroup } from 'three/webgpu'

registerEditorGroups(ClippingGroup, {
  Main: ['clippingPlanes', 'enabled', 'clipIntersection', 'clipShadows'],
})


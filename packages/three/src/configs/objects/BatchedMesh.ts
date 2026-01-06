import { registerEditorGroups } from '@io-gui/editors'
import { BatchedMesh } from 'three/webgpu'

registerEditorGroups(BatchedMesh, {
  Rendering: ['perObjectFrustumCulled', 'sortObjects', 'customSort', 'boundingBox', 'boundingSphere'],
  Advanced: ['maxInstanceCount', 'instanceCount', 'unusedVertexCount', 'unusedIndexCount'],
})


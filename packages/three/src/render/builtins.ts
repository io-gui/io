import { registerPipeline } from './ViewPipeline.js'
import { registerOverlay } from './Overlay.js'
import { ForwardPipeline } from './pipelines/ForwardPipeline.js'
import { UVPipeline } from './pipelines/UVPipeline.js'
import { gridOverlayType } from './overlays/GridOverlay.js'
import { selectionOutlineOverlayType } from './overlays/SelectionOutlineOverlay.js'
import { cameraFrameOverlayType } from './overlays/CameraFrameOverlay.js'
import { componentOverlayType } from './overlays/ComponentOverlay.js'

registerPipeline({id: 'forward', label: 'Forward', viewKinds: ['3d'], create: () => new ForwardPipeline()})
registerPipeline({id: 'uv', label: 'UV layout', viewKinds: ['uv'], create: () => new UVPipeline()})

registerOverlay(gridOverlayType)
registerOverlay(selectionOutlineOverlayType)
registerOverlay(cameraFrameOverlayType)
registerOverlay(componentOverlayType)

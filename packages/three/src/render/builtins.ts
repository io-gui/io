import { pipelineTypes } from './ViewPipeline.js'
import { overlayTypes } from './Overlay.js'
import { ForwardPipeline } from './pipelines/ForwardPipeline.js'
import { UVPipeline } from './pipelines/UVPipeline.js'
import { gridOverlayType } from './overlays/GridOverlay.js'
import { selectionOutlineOverlayType } from './overlays/SelectionOutlineOverlay.js'
import { cameraFrameOverlayType } from './overlays/CameraFrameOverlay.js'
import { componentOverlayType } from './overlays/ComponentOverlay.js'

pipelineTypes
  .register({id: 'forward', label: 'Forward', viewKinds: ['3d'], create: () => new ForwardPipeline()})
  .register({id: 'uv', label: 'UV layout', viewKinds: ['uv'], create: () => new UVPipeline()})

overlayTypes
  .register(gridOverlayType)
  .register(selectionOutlineOverlayType)
  .register(cameraFrameOverlayType)
  .register(componentOverlayType)

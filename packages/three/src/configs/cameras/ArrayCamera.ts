import { registerEditorGroups } from "@io-gui/editors"
import { ArrayCamera } from "three/webgpu"

registerEditorGroups(ArrayCamera, {
  Main: ['cameras'],
  Hidden: ['_reversedDepth'],
})


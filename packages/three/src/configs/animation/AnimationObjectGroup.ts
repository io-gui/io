import { registerEditorGroups } from "@io-gui/editors"
import { AnimationObjectGroup } from "three/webgpu"

registerEditorGroups(AnimationObjectGroup, {
  Main: [],
  Hidden: ['_objects', '_nCachedObjects_', '_indicesByUUID', '_paths', '_parsedPaths', '_bindings', '_bindingsIndicesByPath'],
})


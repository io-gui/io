import { registerEditorGroups } from "@io-gui/editors"
import { PropertyBinding } from "three/webgpu"

registerEditorGroups(PropertyBinding, {
  Main: [
    'path',
    'parsedPath',
  ],
  References: [
    'node',
    'rootNode',
  ],
  Hidden: [
    'BindingType',
    'Versioning',
    'GetterByBindingType',
    'SetterByBindingTypeAndVersioning',
    'getValue',
    'setValue',
  ],
})


import { Register } from '@io-gui/core'
import { Pointer3D, ToolBase } from '@io-gui/three'

@Register
export class PointerTool extends ToolBase {
  on3DPointerDown(pointers: Pointer3D[]) {
    this.dispatch('3dpointer-down', pointers, true)
  }
  on3DPointerMove(pointers: Pointer3D[]) {
    this.dispatch('3dpointer-move', pointers, true)
  }
  on3DPointerUp(pointers: Pointer3D[]) {
    this.dispatch('3dpointer-up', pointers, true)
  }
  on3DPointerCancel(pointers: Pointer3D[]) {
    this.dispatch('3dpointer-cancel', pointers, true)
  }
}
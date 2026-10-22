import { describe, it, expect } from 'vitest'
import { Camera, Mesh, NodeFrame, Object3D, PerspectiveCamera, VelocityNode } from 'three/webgpu'
import { ViewVelocityNode } from '@io-gui/three'

/** Runs a velocity node's per-object hooks for one draw; returns the previous x it gives the shader. */
function draw(node: VelocityNode, frameId: number, camera: Camera, object: Object3D) {
  const frame = {frameId, camera, object} as unknown as NodeFrame
  node.update(frame)
  const previousX = node.previousModelWorldMatrix.value.elements[12]
  node.updateAfter(frame)
  return previousX
}

function moveTo(object: Object3D, x: number) {
  object.position.x = x
  object.updateMatrixWorld()
}

describe('ViewVelocityNode', () => {

  it('measures each camera against the matrix it drew last', () => {
    const node = new ViewVelocityNode()
    const object = new Mesh()
    const a = new PerspectiveCamera()
    const b = new PerspectiveCamera()
    moveTo(object, 0)
    draw(node, 1, a, object)
    draw(node, 1, b, object)

    moveTo(object, 1)
    expect(draw(node, 2, a, object)).toBe(0)
    expect(draw(node, 2, b, object)).toBe(0)
    // Drawn again in the same frame: still the last frame's matrix.
    expect(draw(node, 2, a, object)).toBe(0)

    // `a` skips a frame: its next draw measures from its own last draw.
    moveTo(object, 2)
    expect(draw(node, 3, b, object)).toBe(1)
    moveTo(object, 3)
    expect(draw(node, 4, a, object)).toBe(1)
    expect(draw(node, 4, b, object)).toBe(2)
  })

  // When this fails, three tracks previous matrices per camera: remove the workaround (upstream: velocity-per-view).
  it('three velocity loses object motion for the second camera in a frame', () => {
    const node = new VelocityNode()
    const object = new Mesh()
    const a = new PerspectiveCamera()
    const b = new PerspectiveCamera()
    moveTo(object, 0)
    draw(node, 1, a, object)
    draw(node, 1, b, object)

    moveTo(object, 1)
    expect(draw(node, 2, a, object)).toBe(0)
    expect(draw(node, 2, b, object)).toBe(1)
  })
})

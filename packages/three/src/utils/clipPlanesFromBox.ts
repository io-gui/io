import { Box3, Camera, Vector3 } from 'three/webgpu'

const cameraForward = new Vector3()
const corner = new Vector3()

export function clipPlanesFromBox(box: Box3, cameraPosition: Vector3, camera: Camera, overfit: number = 0.1) {
  cameraForward.set(0, 0, -1).applyQuaternion(camera.quaternion)

  let minDepth = Infinity
  let maxDepth = -Infinity
  for (let i = 0; i < 8; i++) {
    corner.set(
      (i & 1) ? box.max.x : box.min.x,
      (i & 2) ? box.max.y : box.min.y,
      (i & 4) ? box.max.z : box.min.z
    )
    const depth = corner.sub(cameraPosition).dot(cameraForward)
    minDepth = Math.min(minDepth, depth)
    maxDepth = Math.max(maxDepth, depth)
  }
  const span = Math.max(maxDepth - minDepth, 1e-3)
  return {
    // 0.2 near clipping plane overfit bias - smelly hack but works
    // TODO: Reconsider this
    near: Math.max(minDepth - span * overfit * 0.2, span * 0.001),
    far:  maxDepth + span * overfit
  }
}

import { Color, InstancedBufferAttribute, LineBasicNodeMaterial, MeshBasicNodeMaterial, PointsNodeMaterial, DoubleSide } from 'three/webgpu'
import { attribute, cameraFar, cameraNear, float, instancedBufferAttribute, positionView, select, uniform, vec4, viewZToOrthographicDepth, viewZToPerspectiveDepth } from 'three/tsl'
import type { Node } from 'three/webgpu'

const _orthographic = uniform(0).onRenderUpdate(({camera}) => (camera as {isOrthographicCamera?: boolean})?.isOrthographicCamera ? 1 : 0)

/**
 * Fragment depth pulled slightly toward the camera, so wires and points drawn on a surface win the depth
 * test against it (and stay hidden behind other surfaces). Relative in perspective, constant in orthographic.
 */
export function biasedDepthNode(bias = 0.002): Node {
  const z = positionView.z
  const perspective = viewZToPerspectiveDepth(z.mul(1 - bias), cameraNear, cameraFar)
  const orthographic = viewZToOrthographicDepth(z.add(cameraFar.sub(cameraNear).mul(bias * 0.05)), cameraNear, cameraFar)
  return select(_orthographic.greaterThan(0.5), orthographic, perspective) as unknown as Node
}

/** Colors by state: 0 = hidden, 1 = normal, 2 = selected. Alpha 0 for hidden. */
export type StateColors = {normal: Color; normalAlpha: number; selected: Color; selectedAlpha: number}

function stateColor(state: Node, colors: StateColors) {
  const normal = vec4(uniform(colors.normal), colors.normalAlpha)
  const selected = vec4(uniform(colors.selected), colors.selectedAlpha)
  const s = float(state)
  return select(s.greaterThan(1.5), selected, select(s.greaterThan(0.5), normal, vec4(0, 0, 0, 0)))
}

function overlayDefaults<T extends MeshBasicNodeMaterial | LineBasicNodeMaterial | PointsNodeMaterial>(material: T, depthTest: boolean) {
  material.transparent = true
  material.depthWrite = false
  material.depthTest = depthTest
  if (depthTest) material.depthNode = biasedDepthNode()
  return material
}

/** Faces colored by a per-vertex `state` attribute. */
export function stateFaceMaterial(colors: StateColors, depthTest = true) {
  const material = new MeshBasicNodeMaterial({side: DoubleSide})
  material.colorNode = stateColor(attribute('state', 'float'), colors)
  return overlayDefaults(material, depthTest)
}

/** Line segments colored by a per-vertex `state` attribute. */
export function stateLineMaterial(colors: StateColors, depthTest = true) {
  const material = new LineBasicNodeMaterial()
  material.colorNode = stateColor(attribute('state', 'float'), colors)
  return overlayDefaults(material, depthTest)
}

/** Screen-sized squares at instanced positions (use with a `Sprite` whose `count` is the point count). */
export function statePointMaterial(positions: InstancedBufferAttribute, states: InstancedBufferAttribute, colors: StateColors, size: number, depthTest = true) {
  const material = new PointsNodeMaterial({sizeAttenuation: false})
  material.positionNode = instancedBufferAttribute(positions)
  material.sizeNode = float(size)
  material.colorNode = stateColor(instancedBufferAttribute(states) as unknown as Node, colors)
  return overlayDefaults(material, depthTest)
}

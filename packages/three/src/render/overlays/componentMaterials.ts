import { BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Group, InstancedBufferAttribute, LineBasicNodeMaterial, LineSegments, Material, Mesh, MeshBasicNodeMaterial, PointsNodeMaterial, Sprite } from 'three/webgpu'
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

export type CageColors = {faces: StateColors; edges: StateColors; points: StateColors}

function stateGeometry(positions: Float32Array, states: Float32BufferAttribute) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('state', states)
  return geometry
}

/**
 * Faces (triangles), edges (segments) and points with a state per vertex: how edit mode draws the components
 * of an object, and the UV view a layout. Positions are fixed; write the state arrays, then `updateStates()`.
 */
export class StateCage {

  readonly group = new Group()
  readonly faces: Mesh | null = null
  readonly edges: LineSegments
  readonly points: Sprite
  /** One state per face vertex, per edge end and per point: 0 hidden, 1 normal, 2 selected. */
  readonly faceStates: Float32Array | null = null
  readonly edgeStates: Float32Array
  readonly pointStates: Float32Array
  private readonly _attributes: (Float32BufferAttribute | InstancedBufferAttribute)[] = []

  constructor(facePositions: Float32Array | null, edgePositions: Float32Array, pointPositions: Float32Array, colors: CageColors, pointSize: number, depthTest = true) {
    // Float32BufferAttribute copies its array: the state arrays are read back from the attributes.
    if (facePositions) {
      const states = new Float32BufferAttribute(new Float32Array(facePositions.length / 3), 1)
      this.faceStates = states.array as Float32Array
      this.faces = new Mesh(stateGeometry(facePositions, states), stateFaceMaterial(colors.faces, depthTest))
      this._attributes.push(states)
    }
    const edgeStates = new Float32BufferAttribute(new Float32Array(edgePositions.length / 3), 1)
    this.edgeStates = edgeStates.array as Float32Array
    this.edges = new LineSegments(stateGeometry(edgePositions, edgeStates), stateLineMaterial(colors.edges, depthTest))
    const pointStates = new InstancedBufferAttribute(new Float32Array(pointPositions.length / 3), 1)
    this.pointStates = pointStates.array as Float32Array
    this.points = new Sprite(statePointMaterial(new InstancedBufferAttribute(pointPositions, 3), pointStates, colors.points, pointSize, depthTest))
    this.points.count = pointStates.count
    this._attributes.push(edgeStates, pointStates)
    for (const child of [this.faces, this.edges, this.points]) {
      if (!child) continue
      child.frustumCulled = false
      this.group.add(child)
    }
  }

  /** Uploads the state arrays after they were written. */
  updateStates() {
    for (const attribute of this._attributes) attribute.needsUpdate = true
  }

  dispose() {
    this.faces?.geometry.dispose()
    this.edges.geometry.dispose()
    for (const child of [this.faces, this.edges, this.points]) (child?.material as Material | undefined)?.dispose()
  }
}

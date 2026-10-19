import { Box3, BufferGeometry, CameraHelper, Color, DirectionalLightHelper, DoubleSide, Group, HemisphereLightHelper, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, Object3D, PlaneGeometry, PointLightHelper, Quaternion, SkeletonHelper, Sphere, SpotLightHelper, Vector3 } from 'three/webgpu'
import type { Bone, Camera, ClippingGroup, DirectionalLight, HemisphereLight, Light, PointLight, RectAreaLight, SkinnedMesh, SpotLight } from 'three/webgpu'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js'
import { OUTLINE_COLORS } from './SelectionOutlineOverlay.js'
import { KeyedPool } from '../../utils/KeyedPool.js'
import { worldPerPixelAt } from '../../utils/camera.js'

/** Size of point, directional and hemisphere light icons in CSS pixels. */
export const LIGHT_ICON_SIZE = 24

const ACTIVE = new Color(OUTLINE_COLORS.active)
const SELECTED = new Color(OUTLINE_COLORS.selected)
const CAMERA = new Color(0x8c8c8c)
const BONE_START = new Color(0x0000ff)
const BONE_END = new Color(0x00ff00)
/** Clipping planes take the color of their normal's main axis: the translate gizmo's axis colors. */
const PLANE_AXES = [new Color(0xff3352), new Color(0x8bdc00), new Color(0x2890ff)]

/** The helper of one content object, as the overlay keeps it from draw to draw. */
export interface Helper {
  readonly object: Object3D
  /** Follows the content object. `color` is the selection color, or null for the helper's own colors. */
  update(ctx: OverlayContext, color: Color | null): void
  /** False when the content object changed so that the helper must be built again. */
  fits?(): boolean
  dispose(): void
}

/** Which content objects a helper overlay draws for (ADR-0006), and the helper of each. */
export interface HelperKind {
  accepts(object: Object3D): boolean
  create(object: Object3D): Helper
}

/**
 * Draws a three.js helper for each shown content object of one kind (cameras, lights, skeletons), in the
 * view's overlay scene rather than the content scene, so helpers are not exported, framed or picked.
 * Helpers of selected objects take the outline's colors. A view looking through a scene camera skips its helper.
 */
export class HelperOverlay implements Overlay {

  readonly root = new Group()
  private readonly _kind: HelperKind
  private readonly _helpers = new KeyedPool<Helper>(helper => {
    this.root.remove(helper.object)
    helper.dispose()
  })

  constructor(name: string, kind: HelperKind) {
    this.root.name = name
    this._kind = kind
  }

  prepare(ctx: OverlayContext) {
    const kind = this._kind
    const source = ctx.view.getSourceCamera(ctx.document)
    const colors = selectionColors(ctx)
    ctx.scene.traverseVisible(object => {
      if (object === source || !kind.accepts(object)) return
      const helper = this._helpers.get(object.uuid, () => {
        const helper = kind.create(object)
        // Their bounds are computed once, but frustums, cones and bones keep changing.
        helper.object.traverse(child => { child.frustumCulled = false })
        this.root.add(helper.object)
        return helper
      }, helper => helper.fits?.() ?? true)
      helper.update(ctx, colors.get(object.uuid) ?? null)
    })
    this._helpers.sweep()
  }

  dispose() {
    this._helpers.clear()
  }
}

/**
 * Selection colors by object uuid: selected objects and their descendants, as the outline draws them.
 * A selected skinned mesh selects its skeleton's bones too, which are usually not below it.
 */
function selectionColors(ctx: OverlayContext) {
  const colors = new Map<string, Color>()
  const selection = ctx.selection
  // Edit mode draws components instead, and the outline is off.
  if (!selection || ctx.editor.mode === 'edit') return colors
  const mark = (object: Object3D, color: Color) => {
    if (colors.get(object.uuid) !== ACTIVE) colors.set(object.uuid, color)
  }
  for (const object of selection.getObjects()) {
    object.traverse(child => {
      const color = child.uuid === selection.active || object.uuid === selection.active ? ACTIVE : SELECTED
      mark(child, color)
      const skeleton = (child as SkinnedMesh).isSkinnedMesh ? (child as SkinnedMesh).skeleton : null
      if (skeleton) for (const bone of skeleton.bones) mark(bone, color)
    })
  }
  return colors
}

/** Remembers the last selection color, so helpers rewrite their colors only when it changes. */
function colorChanged(helper: {_color?: Color | null}, color: Color | null) {
  if (helper._color === color) return false
  helper._color = color
  return true
}

const _position = new Vector3()
const _quaternion = new Quaternion()
const _scale = new Vector3()

class CameraHelperEntry implements Helper {
  readonly object: CameraHelper
  _color?: Color | null

  constructor(camera: Camera) {
    this.object = new CameraHelper(camera)
  }

  update(_ctx: OverlayContext, color: Color | null) {
    if (colorChanged(this, color)) {
      const lines = color ?? CAMERA
      this.object.setColors(lines, lines, lines, lines, lines)
    }
    // The frustum follows the camera's projection, which the helper does not watch.
    this.object.update()
  }

  dispose() {
    this.object.dispose()
  }
}

type LightHelperObject = PointLightHelper | DirectionalLightHelper | SpotLightHelper | HemisphereLightHelper | RectAreaLightHelper

class LightHelperEntry implements Helper {
  readonly object: LightHelperObject
  _color?: Color | null
  private readonly _light: Light

  constructor(light: Light) {
    this._light = light
    if ((light as PointLight).isPointLight) {
      this.object = new PointLightHelper(light as PointLight, 1)
      // Its own matrix, scaled to the icon size, instead of the light's world matrix.
      this.object.matrix = this.object.matrix.clone()
    } else if ((light as SpotLight).isSpotLight) {
      this.object = new SpotLightHelper(light as SpotLight)
    } else if ((light as DirectionalLight).isDirectionalLight) {
      this.object = new DirectionalLightHelper(light as DirectionalLight, 1)
    } else if ((light as HemisphereLight).isHemisphereLight) {
      this.object = new HemisphereLightHelper(light as HemisphereLight, 1)
    } else {
      this.object = new RectAreaLightHelper(light as RectAreaLight)
    }
  }

  update(ctx: OverlayContext, color: Color | null) {
    const helper = this.object
    const light = this._light
    helper.color = color ?? undefined
    if (helper instanceof HemisphereLightHelper && colorChanged(this, color)) {
      // The sky and ground colors are vertex colors, which would tint the selection color.
      helper.material.vertexColors = !color
      helper.material.needsUpdate = true
    }
    // The rect area helper takes its color when its world matrix updates.
    if (!(helper instanceof RectAreaLightHelper)) helper.update()

    // Icons keep their screen size; spot cones and rect area panels keep their world size.
    light.matrixWorld.decompose(_position, _quaternion, _scale)
    const size = worldPerPixelAt(ctx.camera, _position, ctx.height) * LIGHT_ICON_SIZE / 2
    if (helper instanceof PointLightHelper) {
      helper.matrix.compose(_position, _quaternion, _scale.setScalar(size))
      helper.matrixWorldNeedsUpdate = true
    } else if (helper instanceof DirectionalLightHelper) {
      helper.lightPlane.scale.setScalar(size / light.matrixWorld.getMaxScaleOnAxis())
    } else if (helper instanceof HemisphereLightHelper) {
      helper.children[0].scale.setScalar(size / light.matrixWorld.getMaxScaleOnAxis())
    }
  }

  dispose() {
    this.object.dispose()
  }
}

/** Bones below a root bone, the bones its `SkeletonHelper` draws. */
function countBones(root: Object3D) {
  let count = 0
  root.traverse(object => { if ((object as Bone).isBone) count++ })
  return count
}

class SkeletonHelperEntry implements Helper {
  readonly object: SkeletonHelper
  _color?: Color | null
  private readonly _root: Bone
  private readonly _bones: number

  constructor(root: Bone) {
    this._root = root
    this.object = new SkeletonHelper(root)
    this._bones = countBones(root)
  }

  update(_ctx: OverlayContext, color: Color | null) {
    // The bone lines follow the bones whenever the overlay scene updates world matrices.
    if (colorChanged(this, color)) this.object.setColors(color ?? BONE_START, color ?? BONE_END)
  }

  fits() {
    return countBones(this._root) === this._bones
  }

  dispose() {
    this.object.dispose()
  }
}

/** A unit square facing +Z: the outline (closed, as WebGPU has no line loops) and the fill of a clipping plane helper. */
const PLANE_OUTLINE = new BufferGeometry().setFromPoints([
  new Vector3(-0.5, -0.5, 0), new Vector3(0.5, -0.5, 0), new Vector3(0.5, 0.5, 0), new Vector3(-0.5, 0.5, 0), new Vector3(-0.5, -0.5, 0),
])
const PLANE_FILL = new PlaneGeometry(1, 1)
const PLANE_FILL_OPACITY = 0.2
const PLANE_SIZE_EMPTY = 2

const _box = new Box3()
const _sphere = new Sphere()
const _forward = new Vector3(0, 0, 1)

type PlaneHelperParts = {outline: Line<BufferGeometry, LineBasicMaterial>; fill: Mesh<PlaneGeometry, MeshBasicMaterial>}

/**
 * One square per plane of a clipping group, as three's `PlaneHelper` draws it: an outline, filled while the group is
 * selected (a fill spanning the content would tint the whole view). The planes are in world space (the group's transform
 * does not move them); each square is centered on what the group clips and spans its bounding sphere. A disabled group
 * draws nothing.
 */
class ClippingHelperEntry implements Helper {
  readonly object = new Group()
  private readonly _group: ClippingGroup
  private readonly _planes: PlaneHelperParts[] = []

  constructor(group: ClippingGroup) {
    this._group = group
    for (let i = 0; i < group.clippingPlanes.length; i++) {
      const outline = new Line(PLANE_OUTLINE, new LineBasicMaterial({toneMapped: false}))
      const fill = new Mesh(PLANE_FILL, new MeshBasicMaterial({
        transparent: true, opacity: PLANE_FILL_OPACITY, side: DoubleSide, forceSinglePass: true, depthWrite: false, toneMapped: false,
      }))
      const plane = new Group()
      plane.add(outline, fill)
      this.object.add(plane)
      this._planes.push({outline, fill})
    }
  }

  update(_ctx: OverlayContext, color: Color | null) {
    const group = this._group
    this.object.visible = group.enabled
    if (!group.enabled) return
    _box.setFromObject(group)
    if (_box.isEmpty()) _sphere.set(_sphere.center.set(0, 0, 0), PLANE_SIZE_EMPTY / 2)
    else _box.getBoundingSphere(_sphere)
    const size = Math.max(_sphere.radius * 2, Number.EPSILON)
    group.clippingPlanes.forEach((plane, i) => {
      const helper = this.object.children[i]
      plane.projectPoint(_sphere.center, helper.position)
      helper.quaternion.setFromUnitVectors(_forward, plane.normal)
      helper.scale.setScalar(size)
      const normal = plane.normal
      const axis = Math.abs(normal.x) >= Math.abs(normal.y) && Math.abs(normal.x) >= Math.abs(normal.z) ? 0 : Math.abs(normal.y) >= Math.abs(normal.z) ? 1 : 2
      const parts = this._planes[i]
      parts.outline.material.color.copy(color ?? PLANE_AXES[axis])
      parts.fill.material.color.copy(color ?? PLANE_AXES[axis])
      parts.fill.visible = color !== null
    })
  }

  fits() {
    return this._group.clippingPlanes.length === this._planes.length
  }

  dispose() {
    for (const {outline, fill} of this._planes) {
      outline.material.dispose()
      fill.material.dispose()
    }
  }
}

type Flags = Record<string, boolean | undefined>

export const cameraHelpers: HelperKind = {
  accepts: object => !!((object as unknown as Flags).isPerspectiveCamera || (object as unknown as Flags).isOrthographicCamera),
  create: object => new CameraHelperEntry(object as Camera),
}

/** Lights that have a place in the scene; ambient lights and light probes have no helper. */
export const lightHelpers: HelperKind = {
  accepts: object => {
    const light = object as unknown as Flags
    return !!(light.isPointLight || light.isSpotLight || light.isDirectionalLight || light.isHemisphereLight || light.isRectAreaLight)
  },
  create: object => new LightHelperEntry(object as Light),
}

/** One helper per root bone (a bone whose parent is not a bone), drawn while that bone is shown, mesh or not. */
export const skeletonHelpers: HelperKind = {
  accepts: object => !!(object as Bone).isBone && !(object.parent as Bone | null)?.isBone,
  create: object => new SkeletonHelperEntry(object as Bone),
}

/** Clipping groups (`ClippingGroup`), one plane helper per clipping plane. */
export const clippingHelpers: HelperKind = {
  accepts: object => !!(object as unknown as Flags).isClippingGroup,
  create: object => new ClippingHelperEntry(object as ClippingGroup),
}

export const cameraHelperOverlayType: OverlayType = {
  id: 'cameraHelpers',
  label: 'Camera helpers',
  viewKinds: ['3d'],
  order: 10,
  create: () => new HelperOverlay('CameraHelperOverlay', cameraHelpers),
}

export const lightHelperOverlayType: OverlayType = {
  id: 'lightHelpers',
  label: 'Light helpers',
  viewKinds: ['3d'],
  order: 11,
  create: () => new HelperOverlay('LightHelperOverlay', lightHelpers),
}

export const skeletonHelperOverlayType: OverlayType = {
  id: 'skeletonHelpers',
  label: 'Skeleton helpers',
  viewKinds: ['3d'],
  order: 12,
  create: () => new HelperOverlay('SkeletonHelperOverlay', skeletonHelpers),
}

export const clippingHelperOverlayType: OverlayType = {
  id: 'clippingHelpers',
  label: 'Clipping plane helpers',
  viewKinds: ['3d'],
  order: 13,
  create: () => new HelperOverlay('ClippingHelperOverlay', clippingHelpers),
}

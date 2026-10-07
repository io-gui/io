import { Group, Mesh, MeshBasicNodeMaterial, OrthographicCamera, PerspectiveCamera, Vector2 } from 'three/webgpu'
import { Fn, abs, float, screenUV, select, uniform, vec4 } from 'three/tsl'
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js'
import { createScreenQuad } from '../screenQuad.js'

/**
 * Passepartout for views that look through a scene camera: darkens what lies outside the camera's frame
 * (the view fits the frame inside the viewport with the view's overscan, ADR-0005).
 */
export class CameraFrameOverlay implements Overlay {

  readonly root = new Group()
  /** Opacity of the area outside the frame. */
  readonly opacity = uniform(0.5)

  /** Half size of the frame in normalized device coordinates. */
  private readonly _half = uniform(new Vector2(1, 1))
  private readonly _quad: Mesh
  private readonly _material = new MeshBasicNodeMaterial()

  constructor() {
    this.root.name = 'CameraFrameOverlay'
    const half = this._half
    const opacity = this.opacity
    const material = this._material
    material.name = 'CameraFrameOverlay'
    material.colorNode = Fn(() => {
      const ndc = abs(screenUV.mul(2).sub(1))
      const outside = ndc.x.greaterThan(half.x).or(ndc.y.greaterThan(half.y))
      return vec4(0, 0, 0, select(outside, opacity, float(0)))
    })()
    material.transparent = true
    material.depthTest = false
    material.depthWrite = false
    this._quad = createScreenQuad(material)
    this.root.add(this._quad)
  }

  prepare(ctx: OverlayContext) {
    const source = ctx.view.getSourceCamera(ctx.scene)
    this._quad.visible = !!source
    if (!source) return
    const aspect = ctx.width / Math.max(1, ctx.height)
    let sourceAspect: number
    if ((source as PerspectiveCamera).isPerspectiveCamera) {
      sourceAspect = (source as PerspectiveCamera).aspect
    } else {
      const ortho = source as OrthographicCamera
      sourceAspect = (ortho.right - ortho.left) / Math.max(1e-9, ortho.top - ortho.bottom)
    }
    const overscan = ctx.view.overscan
    if (sourceAspect > aspect) this._half.value.set(1 / overscan, aspect / sourceAspect / overscan)
    else this._half.value.set(sourceAspect / aspect / overscan, 1 / overscan)
  }

  dispose() {
    this._material.dispose()
  }
}

export const cameraFrameOverlayType: OverlayType = {
  id: 'cameraFrame',
  label: 'Camera frame',
  viewKinds: ['3d'],
  enabledByDefault: true,
  order: 200,
  create: () => new CameraFrameOverlay(),
}

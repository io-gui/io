import { Group, Mesh, MeshBasicNodeMaterial, Vector2 } from 'three/webgpu'
import { Fn, abs, float, screenUV, select, uniform, vec4 } from 'three/tsl'
import type { Overlay, OverlayContext, OverlayType } from '../Overlay.js'
import { createScreenQuad } from '../screenQuad.js'

/**
 * Passepartout: darkens what lies outside the view's framed area, the frame of the scene camera it looks through or
 * else the whole viewport (the view fits the frame inside the viewport with the view's overscan, ADR-0005).
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
    const aspect = ctx.width / Math.max(1, ctx.height)
    const frameAspect = ctx.view.getFrameAspect(ctx.width, ctx.height, ctx.document)
    const overscan = ctx.view.overscan
    if (frameAspect > aspect) this._half.value.set(1 / overscan, aspect / frameAspect / overscan)
    else this._half.value.set(frameAspect / aspect / overscan, 1 / overscan)
  }

  dispose() {
    this._material.dispose()
  }
}

export const cameraFrameOverlayType: OverlayType = {
  id: 'cameraFrame',
  label: 'Camera frame',
  viewKinds: ['3d'],
  order: 200,
  create: () => new CameraFrameOverlay(),
}

import { DoubleSide, FloatType, Mesh, MeshBasicNodeMaterial, NoBlending, Object3D, OrthographicCamera, PerspectiveCamera, RenderTarget, Scene, WebGPURenderer } from 'three/webgpu'
import { attribute, positionView, uniform, vec4 } from 'three/tsl'
import type { BufferGeometry } from 'three/webgpu'
import { getGeometryAdapter } from '../geometry/GeometryAdapter.js'
import { KeyedPool } from '../utils/KeyedPool.js'

/**
 * One read-back ID buffer of a view: per CSS pixel, which edit object (`slot`, 1-based index into
 * `objects`, 0 = an occluder or nothing), which primitive (`element`, 1-based, 0 = none) and the
 * view-space depth of the front surface (0 = nothing drawn).
 */
export interface IdBufferData {
  readonly width: number
  readonly height: number
  /** Floats per row (rows are padded to 256 bytes). */
  readonly stride: number
  /** RGBA float per pixel: slot, element, depth, 1. Row 0 is the top. */
  readonly data: Float32Array
  readonly objects: readonly Object3D[]
}

export type IdSample = {slot: number; element: number; depth: number}

/** Reads one pixel of an ID buffer (outside the buffer reads as nothing). */
export function readIdBuffer(buffer: IdBufferData, x: number, y: number, out: IdSample = {slot: 0, element: 0, depth: 0}): IdSample {
  const px = Math.floor(x), py = Math.floor(y)
  if (px < 0 || py < 0 || px >= buffer.width || py >= buffer.height) {
    out.slot = out.element = out.depth = 0
    return out
  }
  const offset = py * buffer.stride + px * 4
  out.slot = Math.round(buffer.data[offset])
  out.element = Math.round(buffer.data[offset + 1])
  out.depth = buffer.data[offset + 2]
  return out
}

type Drawable = Object3D & {isMesh?: boolean; geometry?: BufferGeometry; isInstancedMesh?: boolean}

/**
 * Draws the ID buffer for component picking (ADR-0007): edit objects as non-indexed triangles carrying
 * their primitive index, every other visible mesh as an occluder, into a float target at CSS-pixel size,
 * then reads it back. Proxies share geometry with the scene; content materials are never touched.
 * Deformation (skinning, morph targets) is not applied: components are picked on the rest shape.
 */
export class IdPass {

  private readonly _renderer: WebGPURenderer
  private readonly _target = new RenderTarget(1, 1, {type: FloatType, depthBuffer: true})
  private readonly _scene = new Scene()
  private readonly _proxies = new KeyedPool<Mesh>(proxy => this._scene.remove(proxy))
  private readonly _slot = uniform(0).onObjectUpdate(({object}) => (object?.userData.pickSlot as number | undefined) ?? 0)
  private readonly _idMaterial = new MeshBasicNodeMaterial({side: DoubleSide, blending: NoBlending})
  private readonly _occluderMaterial = new MeshBasicNodeMaterial({side: DoubleSide, blending: NoBlending})

  constructor(renderer: WebGPURenderer) {
    this._renderer = renderer
    this._scene.matrixWorldAutoUpdate = false
    this._idMaterial.colorNode = vec4(this._slot, attribute('pickId', 'float'), positionView.z.negate(), 1)
    this._occluderMaterial.colorNode = vec4(0, 0, positionView.z.negate(), 1)
  }

  /** Draws `objects` (edit set) and the occluders under `scene` and reads the buffer back. */
  async read(scene: Object3D, camera: PerspectiveCamera | OrthographicCamera, objects: readonly Object3D[], width: number, height: number): Promise<IdBufferData> {
    width = Math.max(1, Math.floor(width))
    height = Math.max(1, Math.floor(height))
    if (this._target.width !== width || this._target.height !== height) this._target.setSize(width, height)
    // Picks run from input handlers, between frames: edits since the last draw have not moved matrices yet.
    scene.updateMatrixWorld()
    this._sync(scene, camera, objects)

    const renderer = this._renderer
    const previousTarget = renderer.getRenderTarget()
    // Clear color is not restored: every pipeline and the compositor set their own before clearing.
    try {
      renderer.setRenderTarget(this._target)
      renderer.setClearColor(0x000000, 0)
      renderer.clear()
      renderer.render(this._scene, camera)
    } finally {
      renderer.setRenderTarget(previousTarget)
    }
    const data = await renderer.readRenderTargetPixelsAsync(this._target, 0, 0, width, height) as Float32Array
    return {width, height, stride: Math.ceil(width * 16 / 256) * 256 / 4, data, objects}
  }

  private _sync(scene: Object3D, camera: PerspectiveCamera | OrthographicCamera, objects: readonly Object3D[]) {
    const slots = new Map(objects.map((object, i) => [object, i + 1]))
    scene.traverseVisible(child => {
      const object = child as Drawable
      if (!object.isMesh || !object.geometry || !object.layers.test(camera.layers)) return
      const slot = slots.get(object)
      const geometry = slot ? getGeometryAdapter(object)?.getPrimitiveIdGeometry(object) ?? null : object.isInstancedMesh ? null : object.geometry
      if (!geometry) return
      const proxy = this._proxies.get(`${object.uuid}:${slot ? 'id' : 'occluder'}`, () => {
        const proxy = new Mesh(geometry, slot ? this._idMaterial : this._occluderMaterial)
        proxy.matrixAutoUpdate = false
        proxy.frustumCulled = false
        this._scene.add(proxy)
        return proxy
      })
      proxy.geometry = geometry
      proxy.userData.pickSlot = slot ?? 0
      proxy.matrixWorld.copy(object.matrixWorld)
    })
    this._proxies.sweep()
  }

  dispose() {
    this._target.dispose()
    this._idMaterial.dispose()
    this._occluderMaterial.dispose()
    this._proxies.clear()
  }
}

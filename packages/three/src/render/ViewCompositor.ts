import { Mesh, MeshBasicNodeMaterial, NoBlending, Scene, TextureNode, WebGPURenderer } from 'three/webgpu'
import { screenUV, texture } from 'three/tsl'
import type { DocumentChange } from '../editor/ChangeBus.js'
import type { ThreeView } from '../view/ThreeView.js'
import type { DirtyReason, ViewRenderResult } from './RenderScheduler.js'
import { DEFAULT_PIPELINES, PipelineContext, PipelineOutput, ViewPipeline, getPipelineType } from './ViewPipeline.js'
import { Overlay, OverlayContext, OverlayType, listOverlays } from './Overlay.js'
import { createScreenQuad } from './screenQuad.js'
import { ForwardPipeline } from './pipelines/ForwardPipeline.js'
import './builtins.js'

const PIPELINE_REASONS: readonly DirtyReason[] = ['content', 'view', 'resize', 'continuous']

type OverlayEntry = {overlay: Overlay; type: OverlayType | null; order: number}

/**
 * Draws one view (ADR-0006): runs the view's pipeline when content, navigation or size changed, then presents
 * the pipeline output to the canvas together with the overlays in a single pass of a small overlay scene.
 * When only overlays changed (selection, gizmo hover) the cached pipeline output is presented again.
 * Tone mapping and exposure are applied here, from the view, the pipeline or the document, in that order.
 */
export class ViewCompositor {

  /** Overlay scene: the presented pipeline output first, then each overlay's root. */
  readonly scene = new Scene()

  private readonly _renderer: WebGPURenderer
  private _pipeline: ViewPipeline | null = null
  private _pipelineId = ''
  private readonly _overlays: OverlayEntry[] = []
  private _width = 0
  private _height = 0
  private _hasOutput = false

  private readonly _present: Mesh
  private readonly _presentMaterial = new MeshBasicNodeMaterial()
  private _colorNode: TextureNode | null = null
  private _depthNode: TextureNode | null = null

  constructor(renderer: WebGPURenderer) {
    this._renderer = renderer
    this.scene.matrixWorldAutoUpdate = true
    const material = this._presentMaterial
    material.name = 'ViewCompositor.present'
    material.blending = NoBlending
    material.depthTest = false
    material.depthWrite = false
    this._present = createScreenQuad(material)
    this._present.renderOrder = -Infinity
    this.scene.add(this._present)
  }

  get pipeline(): ViewPipeline | null {
    return this._pipeline
  }

  get overlays(): readonly Overlay[] {
    return this._overlays.map(entry => entry.overlay)
  }

  /** Creates the view's pipeline, or replaces it when `view.pipeline` or `view.kind` changed. */
  syncPipeline(view: ThreeView) {
    const id = view.pipeline || DEFAULT_PIPELINES[view.kind] || 'forward'
    if (this._pipeline && id === this._pipelineId) return
    this._pipeline?.dispose()
    const type = getPipelineType(id)
    if (!type) console.warn(`ViewCompositor: no pipeline "${id}", using "forward"`)
    this._pipeline = type ? type.create(this._renderer) : new ForwardPipeline()
    this._pipelineId = id
    this._width = 0
    this._height = 0
    this._hasOutput = false
  }

  /** Creates and disposes registered overlays to match the view's kind and `overlays` flags. */
  syncOverlays(view: ThreeView) {
    const wanted = listOverlays(view.kind).filter(type => view.overlays[type.id] ?? type.enabledByDefault)
    for (const entry of [...this._overlays]) {
      if (entry.type && !wanted.includes(entry.type)) this.removeOverlay(entry.overlay)
    }
    for (const type of wanted) {
      if (this._overlays.some(entry => entry.type === type)) continue
      this._addEntry({overlay: type.create(), type, order: type.order ?? 0})
    }
  }

  /** Adds an overlay that is not in the registry (the viewport's gizmo layer). */
  addOverlay(overlay: Overlay, order = 0) {
    if (this._overlays.some(entry => entry.overlay === overlay)) return
    this._addEntry({overlay, type: null, order})
  }

  removeOverlay(overlay: Overlay) {
    const index = this._overlays.findIndex(entry => entry.overlay === overlay)
    if (index === -1) return
    const [entry] = this._overlays.splice(index, 1)
    this.scene.remove(entry.overlay.root)
    if (entry.type) entry.overlay.dispose()
  }

  /** How a document change affects this view. */
  listens(change: DocumentChange): DirtyReason | false {
    const fromPipeline = this._pipeline?.listens?.(change)
    if (fromPipeline !== undefined) return fromPipeline
    if (change.kind === 'selection') return 'overlay'
    return 'content'
  }

  /** Draws into the renderer's current canvas target. */
  render(ctx: PipelineContext): ViewRenderResult | void {
    const renderer = this._renderer
    const pipeline = this._pipeline
    if (!pipeline) return

    const width = Math.max(1, Math.floor(ctx.width * ctx.pixelRatio))
    const height = Math.max(1, Math.floor(ctx.height * ctx.pixelRatio))
    if (width !== this._width || height !== this._height) {
      this._width = width
      this._height = height
      pipeline.setSize(width, height)
      this._hasOutput = false
    }

    let result: ViewRenderResult | void = undefined
    if (!this._hasOutput || PIPELINE_REASONS.some(reason => ctx.reasons.has(reason))) {
      result = pipeline.render(ctx)
      this._hasOutput = true
    }
    const output = pipeline.output
    if (!output) return result
    this._setPresented(output)

    const overlayContext: OverlayContext = {...ctx, pipeline, output}
    for (const entry of this._overlays) entry.overlay.prepare(overlayContext)

    renderer.setRenderTarget(null)
    renderer.toneMapping = ctx.view.toneMapping ?? pipeline.toneMapping ?? ctx.document.toneMapping
    renderer.toneMappingExposure = ctx.view.toneMappingExposure ?? ctx.document.toneMappingExposure
    renderer.setClearColor(ctx.view.clearColor, ctx.view.clearAlpha)
    renderer.render(this.scene, ctx.camera)
    return result
  }

  dispose() {
    for (const entry of [...this._overlays]) this.removeOverlay(entry.overlay)
    this._pipeline?.dispose()
    this._pipeline = null
    this._presentMaterial.dispose()
  }

  private _addEntry(entry: OverlayEntry) {
    this._overlays.push(entry)
    this._overlays.sort((a, b) => a.order - b.order)
    entry.overlay.root.renderOrder = entry.order
    this.scene.add(entry.overlay.root)
  }

  /** Points the present quad at the pipeline output; rebuilds the material only when depth appears or goes. */
  private _setPresented(output: PipelineOutput) {
    const material = this._presentMaterial
    if (!this._colorNode) {
      this._colorNode = texture(output.color, screenUV)
      material.colorNode = this._colorNode
    }
    this._colorNode.value = output.color
    const hadDepth = !!this._depthNode && material.depthNode !== null
    if (output.depth) {
      if (!this._depthNode) this._depthNode = texture(output.depth, screenUV)
      this._depthNode.value = output.depth
    }
    if (hadDepth === !!output.depth) return
    // Write the pipeline's depth, so depth-tested overlays (grid) are hidden behind content.
    material.depthNode = output.depth ? this._depthNode!.x : null
    material.depthWrite = !!output.depth
    material.needsUpdate = true
  }
}

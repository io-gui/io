import { Camera, Node, PassNode, PerspectiveCamera, PostProcessing, Scene, WebGPURenderer } from 'three/webgpu'
import { pass } from 'three/tsl'
import type { PipelineContext } from '../ViewPipeline.js'
import type { ViewRenderResult } from '../RenderScheduler.js'
import { RenderTargetPipeline } from './RenderTargetPipeline.js'

/**
 * Builds the post-processing graph from the scene pass. Called again when the view's camera object changes
 * (projection switch, looking through a scene camera), because nodes such as TRAA hold the camera.
 */
export type PostProcessingBuilder = (scenePass: PassNode, camera: Camera) => Node

export type PostProcessingPipelineOptions = {
  /**
   * Frames to keep drawing after the last change, for effects that accumulate (TRAA, progressive
   * path tracing). 0 (default) draws once per change.
   */
  convergeFrames?: number
}

/**
 * A pipeline around three's `PostProcessing` and a `pass(scene, camera)` (ADR-0006). Its output stays linear;
 * the viewport tone-maps when presenting. The scene pass depth is exposed so overlays depth-test against it.
 *
 * ```ts
 * registerPipeline({id: 'bloom', create: renderer =>
 *   new PostProcessingPipeline(renderer, scenePass => scenePass.add(bloom(scenePass)))})
 * ```
 */
export class PostProcessingPipeline extends RenderTargetPipeline {

  readonly postProcessing: PostProcessing
  readonly scenePass: PassNode
  convergeFrames: number

  private readonly _build: PostProcessingBuilder
  private _camera: Camera | null = null
  private _framesSinceChange = 0

  constructor(renderer: WebGPURenderer, build: PostProcessingBuilder, options: PostProcessingPipelineOptions = {}) {
    super()
    this._build = build
    this.convergeFrames = options.convergeFrames ?? 0
    this.scenePass = pass(new Scene(), new PerspectiveCamera())
    this.postProcessing = new PostProcessing(renderer)
    this.postProcessing.outputColorTransform = false
    this.output = {color: this.target.texture, depth: this.scenePass.getTexture('depth')}
  }

  protected draw(ctx: PipelineContext): ViewRenderResult {
    this.scenePass.scene = ctx.scene
    this.scenePass.camera = ctx.camera
    if (this._camera !== ctx.camera) {
      this._camera = ctx.camera
      this.postProcessing.outputNode = this._build(this.scenePass, ctx.camera)
      this.postProcessing.needsUpdate = true
    }
    this.postProcessing.render()
    const changed = ctx.reasons.has('content') || ctx.reasons.has('view') || ctx.reasons.has('resize')
    this._framesSinceChange = changed ? 0 : this._framesSinceChange + 1
    return {converged: this._framesSinceChange >= this.convergeFrames}
  }

  override dispose() {
    this.postProcessing.dispose()
    this.scenePass.dispose()
    super.dispose()
  }
}

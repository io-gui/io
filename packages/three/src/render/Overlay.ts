import type { Object3D } from 'three/webgpu'
import type { OverlayId, ViewKind } from '../view/View.js'
import type { PipelineContext, PipelineOutput, ViewPipeline } from './ViewPipeline.js'
import { Registry } from '../utils/Registry.js'

export interface OverlayContext extends PipelineContext {
  readonly pipeline: ViewPipeline
  readonly output: PipelineOutput
}

/**
 * Something a view draws on top of its pipeline output (ADR-0006): grid, selection outline, camera frame,
 * gizmos. Overlays never touch the content scene; each owns a `root` that the viewport adds to its overlay
 * scene, which is drawn in one pass after the pipeline output (with the pipeline's depth when it has one).
 * Overlay-only redraws reuse the cached pipeline output.
 */
export interface Overlay {
  readonly root: Object3D
  /** Called before every draw of the overlay scene. May render offscreen (masks) but not to the canvas. */
  prepare(ctx: OverlayContext): void
  dispose(): void
}

export interface OverlayType {
  /** Key in `View.overlays`; an overlay registered outside this package declares it in `ViewOverlays`. */
  readonly id: OverlayId
  readonly label?: string
  /**
   * View kinds it is made for. It does not choose where the overlay is created, the view's flags do; turning it on in
   * another kind warns in debug builds.
   */
  readonly viewKinds: readonly ViewKind[]
  /** Lower draws first. */
  readonly order?: number
  create(): Overlay
}

/** Overlays views create by kind and `View.overlays` flags; every overlay is off until a view turns it on. */
export const overlayTypes = new Registry<OverlayType>()

import type { Object3D } from 'three/webgpu'
import type { ViewKind } from '../view/ThreeView.js'
import type { PipelineContext, PipelineOutput, ViewPipeline } from './ViewPipeline.js'

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
  /** Key in `ThreeView.overlays`. */
  readonly id: string
  readonly label?: string
  readonly viewKinds: readonly ViewKind[]
  /** On when the view's `overlays` does not name it. */
  readonly enabledByDefault: boolean
  /** Lower draws first. */
  readonly order?: number
  create(): Overlay
}

const _overlays = new Map<string, OverlayType>()

/** Registers an overlay type. Replaces one with the same id. */
export function registerOverlay(type: OverlayType) {
  _overlays.set(type.id, type)
}

export function getOverlayType(id: string): OverlayType | undefined {
  return _overlays.get(id)
}

/** Registered overlay types for a view kind, in draw order. */
export function listOverlays(viewKind?: ViewKind): OverlayType[] {
  return [..._overlays.values()]
    .filter(type => !viewKind || type.viewKinds.includes(viewKind))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

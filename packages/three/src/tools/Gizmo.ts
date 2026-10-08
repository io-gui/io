import { Group, Object3D } from 'three/webgpu'
import type { ThreeEditor } from '../editor/ThreeEditor.js'
import type { ThreeView } from '../view/ThreeView.js'
import type { DirtyReason } from '../render/RenderScheduler.js'
import type { Overlay, OverlayContext } from '../render/Overlay.js'
import { Behavior, BehaviorPriority } from '../input/Behavior.js'
import type { ViewInputEvent } from '../input/ViewInputEvent.js'
import type { OperatorHost } from './Operator.js'
import type { ViewCamera } from '../utils/camera.js'

/** Pointer distance in CSS pixels within which a gizmo can be hovered and pressed. */
export const GIZMO_HIT_RADIUS = 8

export interface GizmoContext {
  readonly editor: ThreeEditor
  readonly host: OperatorHost
  readonly view: ThreeView
  readonly camera: ViewCamera
  /** CSS pixels. */
  readonly width: number
  readonly height: number
}

/**
 * One handle in a view (Blender's wmGizmo): something drawn in the overlay scene, a screen-space hit test,
 * and an `invoke` that starts an operator when pressed. Gizmos never edit the document themselves.
 */
export interface Gizmo {
  readonly object: Object3D
  highlight: boolean
  /** Distance in CSS pixels from (x, y) to this gizmo; `Infinity` when it cannot be hit. */
  hitTest(ctx: GizmoContext, x: number, y: number): number
  invoke(ctx: GizmoContext, event: ViewInputEvent): void
}

/**
 * Gizmos that appear together (Blender's wmGizmoGroupType). `poll` decides whether the group shows in a view;
 * `refresh` follows the document and selection; `drawPrepare` adapts to the camera (constant screen size).
 * Both run before every draw and before hit tests.
 */
export interface GizmoGroup {
  readonly id: string
  readonly gizmos: readonly Gizmo[]
  poll(ctx: GizmoContext): boolean
  refresh(ctx: GizmoContext): void
  drawPrepare(ctx: GizmoContext): void
  dispose(): void
}

/** What a GizmoLayer needs from its viewport. */
export type GizmoHost = OperatorHost & {
  readonly editor: ThreeEditor | null
  tag(reason: DirtyReason): void
}

/**
 * The gizmos of one viewport: an input behavior in the gizmo band (ADR-0004) and an overlay that draws them.
 * Hovering highlights a gizmo and redraws only overlays; pressing one invokes it, which usually starts a
 * modal operator that takes the pointer from there.
 */
export class GizmoLayer implements Behavior, Overlay {

  readonly priority: number = BehaviorPriority.gizmo
  readonly root = new Group()

  private readonly _host: GizmoHost
  private _groups: GizmoGroup[] = []
  private _hovered: Gizmo | null = null
  private _pressed: Gizmo | null = null

  constructor(host: GizmoHost) {
    this._host = host
    this.root.name = 'GizmoLayer'
  }

  get groups(): readonly GizmoGroup[] {
    return this._groups
  }

  /** Replaces the groups (the active tool's). Old groups are disposed. */
  setGroups(groups: GizmoGroup[]) {
    this._setHovered(null)
    for (const group of this._groups) {
      for (const gizmo of group.gizmos) this.root.remove(gizmo.object)
      group.dispose()
    }
    this._groups = groups
    for (const group of groups) {
      for (const gizmo of group.gizmos) this.root.add(gizmo.object)
    }
    this._host.tag('overlay')
  }

  // Overlay

  prepare(ctx: OverlayContext) {
    const editor = ctx.editor
    const gizmoContext: GizmoContext = {editor, host: this._host, view: ctx.view, camera: ctx.camera, width: ctx.width, height: ctx.height}
    for (const group of this._groups) {
      const visible = group.poll(gizmoContext)
      for (const gizmo of group.gizmos) gizmo.object.visible = visible
      if (!visible) continue
      group.refresh(gizmoContext)
      group.drawPrepare(gizmoContext)
    }
  }

  dispose() {
    this.setGroups([])
  }

  // Behavior

  hover(event: ViewInputEvent): boolean {
    const gizmo = this._hitTest(event)
    this._setHovered(gizmo)
    return !!gizmo
  }

  hoverEnd() {
    this._setHovered(null)
  }

  wantsCapture(event: ViewInputEvent): boolean {
    if (event.type !== 'pointerdown' || event.button !== 0) return false
    const {alt, ctrl, meta} = event.modifiers
    if (alt || ctrl || meta) return false
    this._pressed = this._hitTest(event)
    return !!this._pressed
  }

  begin(event: ViewInputEvent) {
    const gizmo = this._pressed
    const ctx = this._context()
    this._pressed = null
    if (gizmo && ctx) gizmo.invoke(ctx, event)
  }

  private _context(): GizmoContext | null {
    const editor = this._host.editor
    if (!editor) return null
    const rect = this._host.getBoundingClientRect()
    return {editor, host: this._host, view: this._host.view, camera: this._host.getViewCamera(), width: rect.width, height: rect.height}
  }

  private _hitTest(event: ViewInputEvent): Gizmo | null {
    const ctx = this._context()
    if (!ctx) return null
    let best: Gizmo | null = null
    let bestDistance = GIZMO_HIT_RADIUS
    for (const group of this._groups) {
      if (!group.poll(ctx)) continue
      group.refresh(ctx)
      group.drawPrepare(ctx)
      for (const gizmo of group.gizmos) {
        const distance = gizmo.hitTest(ctx, event.x, event.y)
        if (distance <= bestDistance) {
          best = gizmo
          bestDistance = distance
        }
      }
    }
    return best
  }

  private _setHovered(gizmo: Gizmo | null) {
    if (gizmo === this._hovered) return
    if (this._hovered) this._hovered.highlight = false
    this._hovered = gizmo
    if (gizmo) gizmo.highlight = true
    this._host.tag('overlay')
  }
}

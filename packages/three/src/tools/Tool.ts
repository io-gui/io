import type { ThreeEditor } from '../editor/ThreeEditor.js'
import type { Behavior } from '../input/Behavior.js'
import type { ThreeView, ViewKind } from '../view/ThreeView.js'
import type { OperatorHost } from './Operator.js'
import type { GizmoGroup } from './Gizmo.js'

/** What a view's router installs (ADR-0004). */
export type InteractionProfile = 'full' | 'select' | 'navigate' | 'none'

export interface ToolContext {
  readonly editor: ThreeEditor
  readonly host: OperatorHost
  readonly view: ThreeView
}

/**
 * A persistent mode of interaction, defined once and active per view kind + editor mode.
 * Each view gets its own behaviors from `createBehaviors`, so per-view pointer state stays per view.
 */
export interface ToolDefinition {
  readonly id: string
  readonly label: string
  readonly icon?: string
  readonly viewKinds: readonly ViewKind[]
  readonly modes: readonly string[]
  /** Interaction profiles the tool installs in. Default `['full']`; selection tools add `'select'`. */
  readonly profiles?: readonly InteractionProfile[]
  createBehaviors(ctx: ToolContext): Behavior[]
  /** Gizmo groups the tool shows in each view (Blender: a tool's gizmo group). Per view, like behaviors. */
  createGizmoGroups?(ctx: ToolContext): GizmoGroup[]
}

export function toolAllowsProfile(tool: ToolDefinition, profile: InteractionProfile) {
  return (tool.profiles ?? ['full']).includes(profile)
}

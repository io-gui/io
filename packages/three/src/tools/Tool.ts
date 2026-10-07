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

export class ToolRegistry {

  private readonly _tools = new Map<string, ToolDefinition>()

  register(tool: ToolDefinition) {
    debug: {
      if (this._tools.has(tool.id)) console.warn(`ToolRegistry: replacing tool "${tool.id}"`)
    }
    this._tools.set(tool.id, tool)
  }

  get(id: string) {
    return this._tools.get(id)
  }

  /** Tools available for a view kind and mode. */
  list(viewKind?: ViewKind, mode?: string): ToolDefinition[] {
    return [...this._tools.values()].filter(tool =>
      (!viewKind || tool.viewKinds.includes(viewKind)) && (!mode || tool.modes.includes(mode)))
  }
}

export function toolAllowsProfile(tool: ToolDefinition, profile: InteractionProfile) {
  return (tool.profiles ?? ['full']).includes(profile)
}

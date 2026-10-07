import type { ToolDefinition } from './Tool.js'
import { TranslateGizmoGroup } from './gizmos/TranslateGizmoGroup.js'

/** Move tool: the translate gizmo on the selection. Navigation and click selection keep working around it. */
export const translateTool: ToolDefinition = {
  id: 'transform.translate',
  label: 'Move',
  viewKinds: ['3d'],
  modes: ['object'],
  createBehaviors: () => [],
  createGizmoGroups: () => [new TranslateGizmoGroup()],
}

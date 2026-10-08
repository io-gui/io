import { TranslateGizmoGroup } from './gizmos/TranslateGizmoGroup.js';
/** Move tool: the translate gizmo on the selection. Navigation and click selection keep working around it. */
export const translateTool = {
    id: 'transform.translate',
    label: 'Move',
    viewKinds: ['3d'],
    modes: ['object'],
    createBehaviors: () => [],
    createGizmoGroups: () => [new TranslateGizmoGroup()],
};

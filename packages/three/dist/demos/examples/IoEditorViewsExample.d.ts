import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { SelectionModel, ThreeEditor, ThreeView } from '@io-gui/three';
/**
 * Three views of one ThreeEditor, each drawn by a different pipeline (ADR-0006): a forward perspective view
 * with the grid overlay and the Move tool, a TRAA post-processed camera view, and a select-only UV view of the
 * selection. Drag a gizmo arrow to move along an axis, the center to move in the view plane; X / Y / Z switch
 * the axis while dragging, Escape or right click cancels. Tab enters edit mode on the selection; 1 / 2 / 3
 * pick points, edges or faces; the UV view then edits UVs of the faces selected in 3D.
 */
export declare class IoEditorViewsExample extends ReactiveElement {
    static get Style(): string;
    editor: ThreeEditor;
    selection: SelectionModel;
    perspective: ThreeView;
    antialiased: ThreeView;
    uv: ThreeView;
    ready(): void;
    selectionMutated(): void;
    editorMutated(): void;
    changed(): void;
    dispose(): void;
}
export declare const ioEditorViewsExample: (arg0: ReactiveElementProps) => import("@io-gui/core").VDOMElement;

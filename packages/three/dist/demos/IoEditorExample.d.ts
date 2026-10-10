import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { Object3D } from 'three/webgpu';
import { SelectionModel, ThreeEditor, ThreeView } from '@io-gui/three';
/**
 * One ThreeEditor in tabbed views, each with its own pipeline (ADR-0006) and interaction profile: a forward
 * perspective view with the grid overlay and the Move tool, select-only axis views post-processed with TRAA, and a
 * select-only UV view of the selection, and a select-only Camera view through the document's first scene camera.
 * The inspector follows the active object; the Document tab shows the document's own properties.
 * The heading buttons load a ThreeDocument subclass and make it the editor's document. Each loaded document keeps
 * its edits, selection and view navigation when switching back (ADR-0002). Play ticks the document's `onAnimate`; opening a document plays or pauses it by its `autoplay`.
 * Click selects (Shift toggles, Ctrl removes), Alt+drag box-selects, Ctrl+A selects all, Escape clears, F frames the
 * selection. Drag a gizmo arrow to move along an axis, the center to move in the view plane; X / Y / Z switch the
 * axis while dragging, Escape or right click cancels. Tab enters edit mode on the selection; 1 / 2 / 3 pick points,
 * edges or faces; the UV view then edits UVs of the faces selected in 3D.
 */
export declare class IoEditorExample extends ReactiveElement {
    static get Style(): string;
    editor: ThreeEditor;
    views: Record<'top' | 'bottom' | 'left' | 'right' | 'front' | 'back' | 'perspective' | 'uv' | 'camera', ThreeView>;
    /** Selection of the editor's current document; each document has its own. */
    selection: SelectionModel;
    /**
     * The inspected object. The layout keeps the inspector it first rendered, so it binds to this rather than to the
     * selection of one document.
     */
    activeObject: Object3D | undefined;
    /** The document last asked for; it becomes the editor's document once loaded. */
    documentName: string;
    /** Loaded documents by name. A Field: `ready()` runs inside the base constructor. */
    private _documents;
    ready(): void;
    editorMutated(): void;
    selectionChanged(): void;
    selectionMutated(): void;
    documentNameChanged(): void;
    open(name: string): Promise<void>;
    changed(): void;
    dispose(): void;
}
export declare const ioEditorExample: (arg0: ReactiveElementProps) => import("@io-gui/core").VDOMElement;

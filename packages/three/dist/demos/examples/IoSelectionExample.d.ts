import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { SelectionModel, ThreeEditor, ThreeView } from '@io-gui/three';
/**
 * ThreeEditor with two viewports on one document: a full perspective view and a select-only top view.
 * Click selects (Shift toggles, Ctrl removes), Alt+drag box-selects, Ctrl+A selects all, Escape clears,
 * F frames the selection. The inspector follows the active object.
 */
export declare class IoSelectionExample extends ReactiveElement {
    static get Style(): string;
    editor: ThreeEditor;
    selection: SelectionModel;
    perspective: ThreeView;
    top: ThreeView;
    ready(): void;
    selectionMutated(): void;
    changed(): void;
    dispose(): void;
}
export declare const ioSelectionExample: (arg0: ReactiveElementProps) => import("@io-gui/core").VDOMElement;

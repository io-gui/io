import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { ThreeEditor } from './ThreeEditor.js';
interface ThreeEditorStatusProps extends ReactiveElementProps {
    editor: ThreeEditor;
}
export declare class ThreeEditorStatus extends ReactiveElement {
    static get Style(): string;
    editor: ThreeEditor;
    /** The document whose commits are listened to; follows `editor.document`. */
    private _document;
    constructor(props: ThreeEditorStatusProps);
    ready(): void;
    editorMutated(): void;
    onCommit(): void;
    changed(): void;
}
export declare const threeEditorStatus: (props: ThreeEditorStatusProps) => import("@io-gui/core").VDOMElement;
export {};

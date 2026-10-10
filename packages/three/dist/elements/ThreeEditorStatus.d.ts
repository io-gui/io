import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { Editor } from '../editor/Editor.js';
interface ThreeEditorStatusProps extends ReactiveElementProps {
    editor: Editor;
}
export declare class ThreeEditorStatus extends ReactiveElement {
    static get Style(): string;
    editor: Editor;
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

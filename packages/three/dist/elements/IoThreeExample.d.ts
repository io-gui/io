import { ReactiveElement } from '@io-gui/core';
import { ThreeEditor } from '../editor/ThreeEditor.js';
export declare class IoThreeExample extends ReactiveElement {
    static get Style(): string;
    editor: ThreeEditor;
    ready(): void;
    dispose(): void;
}
export declare const ioThreeExample: (arg0: any) => import("@io-gui/core").VDOMElement;

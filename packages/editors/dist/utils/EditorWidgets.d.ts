import { AnyConstructor, VDOMElement } from 'io-core';
export type EditorWidgets = Map<AnyConstructor, VDOMElement>;
export declare function getEditorWidget(object: object, editorWidgets?: EditorWidgets): VDOMElement | null;
export declare function registerEditorWidget(constructor: AnyConstructor, widget: VDOMElement): void;
//# sourceMappingURL=EditorWidgets.d.ts.map
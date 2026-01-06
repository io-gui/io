import { AnyConstructor, VDOMElement } from '@io-gui/core';
export type EditorWidgets = Map<AnyConstructor, VDOMElement>;
export declare function getEditorWidget(object: object): VDOMElement | null;
export declare function registerEditorWidget(constructor: AnyConstructor, widget: VDOMElement): void;
//# sourceMappingURL=EditorWidgets.d.ts.map
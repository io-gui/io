import { AnyConstructor, VDOMElement } from 'io-gui';
export type PropertyIdentifier = AnyConstructor | string | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMElement];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMElement>;
export type PropertyConfigRecord = Record<string, VDOMElement>;
export type EditorConfig = Map<AnyConstructor, PropertyConfig[]>;
export declare function getEditorConfig(object: object, editorConfig?: EditorConfig): PropertyConfigRecord;
//# sourceMappingURL=editor-config.d.ts.map
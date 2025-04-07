import { AnyConstructor, VDOMArray } from 'io-gui';
export type PropertyIdentifier = AnyConstructor | string | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMArray];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMArray>;
export type PropertyConfigRecord = Record<string, VDOMArray>;
export type EditorConfig = Map<AnyConstructor, PropertyConfig[]>;
export declare function getEditorConfig(object: object, editorConfig?: EditorConfig): PropertyConfigRecord;
//# sourceMappingURL=editor-config.d.ts.map
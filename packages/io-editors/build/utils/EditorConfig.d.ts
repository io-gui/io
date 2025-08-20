import { AnyConstructor, VDOMElement } from 'io-core';
type PropertyIdentifier = AnyConstructor | string | RegExp | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMElement];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMElement>;
export type PropertyConfigRecord = Record<string, VDOMElement>;
export type EditorConfig = Map<AnyConstructor, PropertyConfig[]>;
export declare function getEditorConfig(object: object, editorConfig?: EditorConfig): PropertyConfigRecord;
export declare function registerEditorConfig(constructor: AnyConstructor, propertyTypes: PropertyConfig[]): void;
export {};
//# sourceMappingURL=EditorConfig.d.ts.map
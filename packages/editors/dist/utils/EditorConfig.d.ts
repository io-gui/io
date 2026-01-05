import { AnyConstructor, VDOMElement } from '@io-gui/core';
type PropertyIdentifier = AnyConstructor | string | RegExp | null | undefined;
type IsLabeled = true | false;
export type PropertyConfig = [PropertyIdentifier, VDOMElement, IsLabeled?];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMElement>;
export type PropertyConfigRecord = Record<string, VDOMElement>;
export type EditorConfig = Map<AnyConstructor, PropertyConfig[]>;
export declare function getEditorConfig(object: object, propertyConfigs: PropertyConfig[]): PropertyConfigRecord;
export declare function registerEditorConfig(constructor: AnyConstructor, propertyTypes: PropertyConfig[]): void;
export {};
//# sourceMappingURL=EditorConfig.d.ts.map
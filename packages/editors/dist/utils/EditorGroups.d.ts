import { AnyConstructor } from '@io-gui/core';
export declare const SKIPPED_PROPERTIES: string[];
export declare function getAllPropertyNames(obj: object): string[];
type PropertyIdentifier = string | RegExp;
export type PropertyGroups = Record<string, Array<PropertyIdentifier>>;
export type PropertyGroupsRecord = Record<string, Array<string>>;
export type EditorGroups = Map<AnyConstructor, PropertyGroups>;
export declare function getEditorGroups(object: object, propertyGroups: PropertyGroups): PropertyGroupsRecord;
export declare function registerEditorGroups(constructor: AnyConstructor, groups: PropertyGroups): void;
export {};
//# sourceMappingURL=EditorGroups.d.ts.map
import { Constructor, VDOMArray } from 'io-gui';
import 'io-color';
import 'io-inputs';
export type PropertyIdentifier = Constructor | string | null | undefined;
export type PropertyConfig = [PropertyIdentifier, VDOMArray];
export type PropertyConfigMap = Map<PropertyIdentifier, VDOMArray>;
export type PropertyConfigRecord = Record<string, VDOMArray>;
export type EditorConfig = Map<Constructor, PropertyConfig[]>;
export declare function getEditorConfig(object: object, editorConfig?: EditorConfig): PropertyConfigRecord;
//# sourceMappingURL=editor-config.d.ts.map
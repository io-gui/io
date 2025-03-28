import { Constructor, IoNode, IoNodeConstructor, IoElement, VDOMArray } from 'io-gui';
type PropertyTypeKey = Constructor | string | null | undefined;
type PropertyConfig = [PropertyTypeKey, VDOMArray];
type PropertyConfigCollection = [Constructor, PropertyConfig[]];
export interface IoPropertiesConstructor<T> extends IoNodeConstructor<T> {
    Config?: PropertyConfigCollection[];
}
export declare class ProtoObjectConfig extends Map<Constructor, Map<PropertyTypeKey, VDOMArray>> {
    constructor(constructors: IoPropertiesConstructor<any>[]);
    getObjectConfig(object: object): Record<string, VDOMArray> | undefined;
}
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoProperties extends IoElement {
    static get Style(): string;
    reactivity: 'none' | 'immediate' | 'debounced';
    value: Record<string, any> | any[];
    properties: string[];
    config: Record<string, any>;
    widget: VDOMArray;
    labeled: boolean;
    static get Config(): PropertyConfigCollection[];
    _onValueInput(event: CustomEvent): void;
    valueMutated(): void;
    changed(): void;
    Register(ioNodeConstructor: typeof IoNode): void;
}
export {};
//# sourceMappingURL=io-properties.d.ts.map
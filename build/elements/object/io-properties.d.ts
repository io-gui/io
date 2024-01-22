import { Constructor, IoNode, IoNodeConstructor } from '../../core/node.js';
import { IoElement, VDOMArray } from '../../core/element.js';
export interface IoPropertiesConstructor<T> extends IoNodeConstructor<T> {
    Config?: ObjectConfig[];
}
type PropertyTypeKey = Constructor | string | null | undefined;
type PropertyConfig = [PropertyTypeKey, VDOMArray];
type ObjectConfig = [Constructor, PropertyConfig[]];
export declare class ProtoObjectConfig extends Map<Constructor, Map<PropertyTypeKey, VDOMArray>> {
    constructor(constructors: IoPropertiesConstructor<any>[]);
    getObjectConfig(object: object): Record<string, VDOMArray> | undefined;
}
/**
 * Object editor. It displays a set of labeled property editors for the `value` object. Labels can be omitted by setting `labeled` property to false.
 **/
export declare class IoProperties extends IoElement {
    static get Style(): string;
    value: Record<string, any> | any[];
    properties: string[];
    config: Record<string, any>;
    widget: VDOMArray;
    labeled: boolean;
    static get Config(): ObjectConfig[];
    _onValueInput(event: CustomEvent): void;
    valueMutated(): void;
    changed(): void;
    _changedThrottled(): void;
    _onChange(): void;
    Register(ioNodeConstructor: typeof IoNode): void;
}
export {};
//# sourceMappingURL=io-properties.d.ts.map
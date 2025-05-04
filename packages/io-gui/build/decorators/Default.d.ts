import { Node, AnyConstructor } from '../nodes/Node';
export declare const propertyDefaults: WeakMap<AnyConstructor, Record<string, any>>;
/**
 * Sets a default value for a property.
 * @param {any} defaultValue - Default value.
 * @return {Function} Property decorator function.
 */
export declare const Default: (defaultValue: any) => (target: Node, propertyName: string) => void;
//# sourceMappingURL=Default.d.ts.map
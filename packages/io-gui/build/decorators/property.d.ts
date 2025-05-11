import { Node, AnyConstructor } from '../nodes/Node';
export declare const propertyDecorators: WeakMap<AnyConstructor, Record<string, any>>;
/**
 * Sets a initial value for a property.
 * @param {any} initialValue - Initial value.
 * @return {Function} Property decorator function.
 */
export declare const Property: (initialValue: any) => (target: Node, propertyName: string) => void;
//# sourceMappingURL=Property.d.ts.map
/**
 * Autobinds a method to the instance.
 * @param {Function} target - The target object.
 * @param {string | symbol} propertyKey - The name of the property.
 * @param {PropertyDescriptor} descriptor - The descriptor of the property.
 * @returns {PropertyDescriptor} The modified descriptor.
 */
export declare const Autobind: (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    configurable: boolean;
    enumerable: boolean;
    get(): any;
    set(value: any): void;
};
//# sourceMappingURL=Autobind.d.ts.map
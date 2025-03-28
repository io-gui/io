/**
 * Autobinds a method to the instance.
 * @param {Function} target - The target object.
 * @param {string | symbol} propertyKey - The name of the property.
 * @param {PropertyDescriptor} descriptor - The descriptor of the property.
 * @returns {PropertyDescriptor} The modified descriptor.
 */
export const Autobind = function (target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    return {
        configurable: true,
        enumerable: false,
        get() {
            if (this === target.prototype || Object.prototype.hasOwnProperty.call(this, propertyKey)) {
                return originalMethod;
            }
            const boundMethod = originalMethod.bind(this);
            Object.defineProperty(this, propertyKey, {
                configurable: true,
                writable: true,
                enumerable: false,
                value: boundMethod
            });
            return boundMethod;
        },
        set(value) {
            Object.defineProperty(this, propertyKey, {
                configurable: true,
                writable: true,
                enumerable: true,
                value
            });
        }
    };
};
//# sourceMappingURL=autobind.js.map
export const styleDecorators = new WeakMap();
export function Style(style) {
    return (target) => {
        // Add the Style static property to the class
        Object.defineProperty(target, 'Style', {
            get() {
                return style;
            },
            configurable: true,
            enumerable: true
        });
        // Also store in WeakMap for potential future use
        styleDecorators.set(target, style);
    };
}
//# sourceMappingURL=Style.js.map
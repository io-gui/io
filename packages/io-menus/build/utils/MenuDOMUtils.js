import { IoOverlaySingleton } from 'io-core';
const MenuElementTags = ['io-menu-item', 'io-menu-options', 'io-menu-hamburger', 'io-option-select', 'io-string', 'io-menu-tree'];
const MenuElementTagsSelector = MenuElementTags.join(', ');
export function getHoveredMenuItem(event) {
    const options = Array.from(IoOverlaySingleton.querySelectorAll('io-menu-item, io-menu-options'));
    const hovered = [];
    if (IoOverlaySingleton.expanded) {
        for (let i = options.length; i--;) {
            if (isPointerAboveIoMenuItem(event, options[i]))
                hovered.push(options[i]);
        }
    }
    if (hovered.length) {
        hovered.sort((a, b) => {
            if (a.depth > b.depth)
                return 1;
            if (a.depth < b.depth)
                return -1;
            if (a.localName === 'io-menu-item')
                return 1;
            if (b.localName === 'io-menu-item')
                return -1;
            return 0;
        });
        const first = hovered[0];
        const second = hovered[1];
        if (first.localName === 'io-menu-item') {
            return first;
            // NOTE: This effectively blocks picking io-menu-item behind io-menu-options.
        }
        else if (first.localName === 'io-menu-options' && second) {
            if (second.localName === 'io-menu-item' && second.depth === first.depth) {
                return second;
            }
        }
    }
    return undefined;
}
export function getMenuDescendants(element) {
    const descendants = [];
    if (element.$options) {
        descendants.push(element.$options);
        const options = element.$options.querySelectorAll(MenuElementTagsSelector);
        for (let i = options.length; i--;) {
            descendants.push(options[i]);
            descendants.push(...getMenuDescendants(options[i]));
        }
    }
    else {
        const options = Array.from(element.querySelectorAll(MenuElementTagsSelector));
        for (let i = options.length; i--;) {
            descendants.push(options[i]);
            descendants.push(...getMenuDescendants(options[i]));
        }
    }
    return descendants;
}
export function getMenuAncestors(element) {
    const ancestors = [];
    let option = element;
    while (option && option.$parent) { // && !option.$parent._disposed
        option = option.$parent;
        if (option)
            ancestors.push(option);
    }
    return ancestors;
}
export function getMenuChildren(element) {
    const children = [];
    const options = Array.from(element.querySelectorAll(MenuElementTagsSelector));
    for (let i = options.length; i--;) {
        children.push(options[i]);
    }
    if (element.$options) {
        children.push(element.$options);
        const options = element.$options.querySelectorAll(MenuElementTagsSelector);
        for (let i = options.length; i--;) {
            children.push(options[i]);
        }
    }
    return children;
}
export function getMenuSiblings(element) {
    const siblings = [];
    const parent = element.parentElement;
    if (parent) {
        siblings.push(...Array.from(parent.querySelectorAll(MenuElementTagsSelector)));
    }
    return siblings;
}
export function getMenuRoot(element) {
    let root = element;
    while (root && root.$parent) {
        root = root.$parent;
    }
    return root;
}
export function isPointerAboveIoMenuItem(event, element) {
    if (MenuElementTags.indexOf(element.localName) !== -1) {
        if (!element.disabled) {
            if (element.parentElement !== IoOverlaySingleton && element.parentElement.expanded) {
                const r = element.getBoundingClientRect();
                const x = event.clientX;
                const y = event.clientY;
                const hovered = (r.top <= y && r.bottom >= y && r.left <= x && r.right >= x);
                return hovered;
            }
        }
    }
    return false;
}
//# sourceMappingURL=MenuDOMUtils.js.map
import { IoOverlaySingleton } from '@io-gui/core';
const MenuElementTags = ['io-option', 'io-menu', 'io-menu-hamburger', 'io-option-select', 'io-string', 'io-menu-tree'];
const MenuElementTagsSelector = MenuElementTags.join(', ');
export function getHoveredOption(event) {
    const options = Array.from(IoOverlaySingleton.querySelectorAll('io-option, io-menu'));
    const hovered = [];
    if (IoOverlaySingleton.expanded) {
        for (let i = options.length; i--;) {
            if (isPointerAboveIoOption(event, options[i]))
                hovered.push(options[i]);
        }
    }
    if (hovered.length) {
        hovered.sort((a, b) => {
            const aDepth = a.depth;
            const bDepth = b.depth;
            if (aDepth !== undefined && bDepth !== undefined) {
                if (aDepth > bDepth)
                    return 1;
                if (aDepth < bDepth)
                    return -1;
            }
            if (a.localName === 'io-option')
                return 1;
            if (b.localName === 'io-option')
                return -1;
            return 0;
        });
        const first = hovered[0];
        const second = hovered[1];
        if (first.localName === 'io-option') {
            return first;
            // NOTE: This effectively blocks picking io-option behind io-menu.
        }
        else if (first.localName === 'io-menu' && second) {
            if (second.localName === 'io-option' && second.depth === first.depth) {
                return second;
            }
        }
    }
    return undefined;
}
export function getMenuDescendants(element) {
    const descendants = [];
    const menuElement = element;
    if (menuElement.$menu) {
        descendants.push(menuElement.$menu);
        const options = menuElement.$menu.querySelectorAll(MenuElementTagsSelector);
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
    while (option && option.$parent) {
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
    const menuElement = element;
    if (menuElement.$menu) {
        children.push(menuElement.$menu);
        const options = menuElement.$menu.querySelectorAll(MenuElementTagsSelector);
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
export function isPointerAboveIoOption(event, element) {
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

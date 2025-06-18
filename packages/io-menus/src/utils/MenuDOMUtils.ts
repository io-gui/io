import { IoOverlaySingleton } from 'io-gui';
import { IoString } from 'io-inputs';
import { IoMenuItem } from '../elements/IoMenuItem.js';
import { IoMenuOptions } from '../elements/IoMenuOptions.js';
import { IoMenuTree } from '../elements/IoMenuTree.js';

export type IoMenuElementType = IoMenuItem | IoMenuOptions | IoMenuTree | IoString;

const MenuElementTags = ['io-menu-item', 'io-menu-options', 'io-menu-hamburger', 'io-option-select', 'io-string', 'io-menu-tree'];
const MenuElementTagsSelector = MenuElementTags.join(', ');

export function getHoveredMenuItem(event: PointerEvent) {
  const items = IoOverlaySingleton.querySelectorAll('io-menu-item, io-menu-options');
  const hovered: IoMenuElementType[] = [];
  if (IoOverlaySingleton.expanded) {
    for (let i = items.length; i--;) {
      if (isPointerAboveIoMenuItem(event, items[i])) hovered.push(items[i]);
    }
  }
  if (hovered.length) {
    hovered.sort((a: IoMenuElementType, b: IoMenuElementType) => {
      if (a.depth > b.depth) return 1;
      if (a.depth < b.depth) return -1;
      if (a.localName === 'io-menu-item') return 1;
      if (b.localName === 'io-menu-item') return -1;
      return 0;
    });
    const first = hovered[0];
    const second = hovered[1];
    if (first.localName === 'io-menu-item') {
      return first;
    // NOTE: This effectively blocks picking io-menu-item behind io-menu-options.
    } else if (first.localName === 'io-menu-options' && second) {
      if (second.localName === 'io-menu-item' && second.depth === first.depth) {
        return second;
      }
    }
  }
  return undefined;
}

export function getMenuDescendants(element: IoMenuElementType) {
  const descendants: IoMenuElementType[] = [];
  if (element.$options) {
    descendants.push(element.$options);
    const items = element.$options.querySelectorAll(MenuElementTagsSelector);
    for (let i = items.length; i--;) {
      descendants.push(items[i]);
      descendants.push(...getMenuDescendants(items[i]));
    }
  } else {
    const items = element.querySelectorAll(MenuElementTagsSelector);
    for (let i = items.length; i--;) {
      descendants.push(items[i]);
      descendants.push(...getMenuDescendants(items[i]));
    }
  }
  return descendants;
}

export function getMenuAncestors(element: IoMenuElementType) {
  const ancestors: IoMenuElementType[] = [];
  let item = element;
  while (item && item.$parent) { // && !item.$parent._disposed
    item = item.$parent;
    if (item) ancestors.push(item);
  }
  return ancestors;
}

export function getMenuChildren(element: IoMenuElementType) {
  const children: IoMenuElementType[] = [];
  const items = element.querySelectorAll(MenuElementTagsSelector);
  for (let i = items.length; i--;) {
    children.push(items[i]);
  }
  if (element.$options) {
    children.push(element.$options);
    const items = element.$options.querySelectorAll(MenuElementTagsSelector);
    for (let i = items.length; i--;) {
      children.push(items[i]);
    }
  }
  return children;
}

export function getMenuSiblings(element: IoMenuItem) {
  const siblings: IoMenuItem[] = [];
  const parent = element.parentElement;
  if (parent) {
    siblings.push(...parent.querySelectorAll(MenuElementTagsSelector));
  }
  return siblings;
}

export function getMenuRoot(element: IoMenuElementType) {
  let root: IoMenuElementType = element;
  while (root && root.$parent) {
    root = root.$parent;
  }
  return root;
}

export function isPointerAboveIoMenuItem(event: PointerEvent, element: IoMenuElementType) {
  if (MenuElementTags.indexOf(element.localName) !== -1) {
    if (!element.disabled && !element.hidden) {
      if (element.parentElement !== IoOverlaySingleton && element.parentElement.expanded) {
        const r = element.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        const hovered = (r.top <= y && r.bottom >= y && r.left <= x && r.right >= x );
        return hovered;
      }
    }
  }
  return false;
}
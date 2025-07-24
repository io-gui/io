import { IoOverlaySingleton } from 'io-gui';
import { IoString } from 'io-inputs';
import { IoMenuItem } from '../elements/IoMenuItem.js';
import { IoMenuOptions } from '../elements/IoMenuOptions.js';
import { IoMenuTree } from '../elements/IoMenuTree.js';

// TODO: Fix type remove any!

export type IoMenuElementType = IoMenuItem | IoMenuOptions | IoMenuTree | IoString;

const MenuElementTags = ['io-menu-item', 'io-menu-options', 'io-menu-hamburger', 'io-option-select', 'io-string', 'io-menu-tree'];
const MenuElementTagsSelector = MenuElementTags.join(', ');

export function getHoveredMenuItem(event: PointerEvent) {
  const options = Array.from(IoOverlaySingleton.querySelectorAll('io-menu-item, io-menu-options')) as IoMenuItem[];
  const hovered: IoMenuElementType[] = [];
  if (IoOverlaySingleton.expanded) {
    for (let i = options.length; i--;) {
      if (isPointerAboveIoMenuItem(event, options[i])) hovered.push(options[i]);
    }
  }
  if (hovered.length) {
    hovered.sort((a: IoMenuElementType, b: IoMenuElementType) => {
      if ((a as any).depth > (b as any).depth) return 1;
      if ((a as any).depth < (b as any).depth) return -1;
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
      if (second.localName === 'io-menu-item' && (second as any).depth === (first as any).depth) {
        return second;
      }
    }
  }
  return undefined;
}

export function getMenuDescendants(element: IoMenuElementType) {
  const descendants: IoMenuElementType[] = [];
  if ((element as any).$options) {
    descendants.push((element as any).$options);
    const options = (element as any).$options.querySelectorAll(MenuElementTagsSelector);
    for (let i = options.length; i--;) {
      descendants.push(options[i]);
      descendants.push(...getMenuDescendants(options[i]));
    }
  } else {
    const options = Array.from(element.querySelectorAll(MenuElementTagsSelector)) as IoMenuElementType[];
    for (let i = options.length; i--;) {
      descendants.push(options[i]);
      descendants.push(...getMenuDescendants(options[i]));
    }
  }
  return descendants;
}

export function getMenuAncestors(element: IoMenuElementType) {
  const ancestors: IoMenuElementType[] = [];
  let option = element;
  while (option && (option as any).$parent) { // && !option.$parent._disposed
    option = (option as any).$parent;
    if (option) ancestors.push(option);
  }
  return ancestors;
}

export function getMenuChildren(element: IoMenuElementType) {
  const children: IoMenuElementType[] = [];
  const options = Array.from(element.querySelectorAll(MenuElementTagsSelector)) as IoMenuElementType[];
  for (let i = options.length; i--;) {
    children.push(options[i]);
  }
  if ((element as any).$options) {
    children.push((element as any).$options);
    const options = (element as any).$options.querySelectorAll(MenuElementTagsSelector);
    for (let i = options.length; i--;) {
      children.push(options[i]);
    }
  }
  return children;
}

export function getMenuSiblings(element: IoMenuItem) {
  const siblings: IoMenuItem[] = [];
  const parent = element.parentElement;
  if (parent) {
    siblings.push(...Array.from(parent.querySelectorAll(MenuElementTagsSelector)) as IoMenuItem[]);
  }
  return siblings;
}

export function getMenuRoot(element: IoMenuElementType) {
  let root: IoMenuElementType = element;
  while (root && (root as any).$parent) {
    root = (root as any).$parent;
  }
  return root;
}

export function isPointerAboveIoMenuItem(event: PointerEvent, element: IoMenuElementType) {
  if (MenuElementTags.indexOf(element.localName) !== -1) {
    if (!(element as any).disabled) {
      if (element.parentElement !== IoOverlaySingleton && (element.parentElement as any)!.expanded) {
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
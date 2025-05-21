import { IoOverlaySingleton } from 'io-gui';
import { IoString } from 'io-inputs';
import { IoMenuItem } from '../elements/IoMenuItem';
import { IoMenuOptions } from '../elements/IoMenuOptions';

export type IoMenuElementType = IoMenuItem | IoMenuOptions | IoString;

const MenuElementTags = ['io-menu-item', 'io-menu-hamburger', 'io-option-menu', 'io-string'];
const MenuElementTagsSelector = MenuElementTags.join(', ');

export function getMenuDescendants(element: IoMenuElementType) {
  const descendants: IoMenuElementType[] = [];
  if (element.$options) {
    if (element.expanded) {
      descendants.push(element.$options);
      const items = element.$options.querySelectorAll(MenuElementTagsSelector);
      for (let i = items.length; i--;) {
        descendants.push(items[i]);
        if (items[i].expanded) descendants.push(...getMenuDescendants(items[i]));
      }
    }
  } else {
    const items = element.querySelectorAll(MenuElementTagsSelector);
    for (let i = items.length; i--;) {
      descendants.push(items[i]);
      if (items[i].expanded) descendants.push(...getMenuDescendants(items[i]));
    }
  }
  return descendants;
}

export function getMenuAncestors(element: IoMenuElementType) {
  const ancestors: IoMenuElementType[] = [];
  let item = element;
  while (item && item.$parent) {
    item = item.$parent;
    if (item) ancestors.push(item);
  }
  return ancestors;
}

export function getMenuChildren(element: IoMenuElementType) {
  const children: IoMenuElementType[] = [];
  if (element.$options) {
    if (element.expanded) {
      children.push(element.$options);
      const items = element.$options.querySelectorAll(MenuElementTagsSelector);
      for (let i = items.length; i--;) {
        children.push(items[i]);
      }
    }
  }
  return children;
}

export function getMenuSiblings(element: IoMenuItem) {
  const siblings: IoMenuItem[] = [];
  const parent = element.$parent;
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
    // TODO: hidden in no longer a property.
    if (!element.disabled && !element.hidden) {
      if (!element.inlayer || (element.parentElement.expanded && IoOverlaySingleton.expanded)) {
        const bw = 1; // TODO: temp hack to prevent picking items below through margin(1px) gaps.
        const r = element.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        const hovered = (r.top <= y+bw && r.bottom >= y-bw && r.left <= x+bw && r.right >= x-bw );
        return hovered;
      }
    }
  }
  return false;
}
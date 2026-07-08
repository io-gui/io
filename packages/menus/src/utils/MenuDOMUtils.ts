import { IoOverlaySingleton } from '@io-gui/core'
import { IoString } from '@io-gui/inputs'
import { IoOption } from '../elements/IoOption.js'
import { IoMenu } from '../elements/IoMenu.js'
import { IoMenuTree } from '../elements/IoMenuTree.js'

export type IoMenuElementType = IoOption | IoMenu | IoMenuTree | IoString

interface MenuDOMNode {
  depth?: number
  disabled?: boolean
  expanded?: boolean
  $menu?: IoMenu
  $parent?: IoMenuElementType
}

const MenuElementTags = ['io-option', 'io-menu', 'io-menu-hamburger', 'io-option-select', 'io-string', 'io-menu-tree']
const MenuElementTagsSelector = MenuElementTags.join(', ')

export function getHoveredOption(event: PointerEvent) {
  const options = Array.from(IoOverlaySingleton.querySelectorAll('io-option, io-menu')) as IoOption[]
  const hovered: IoMenuElementType[] = []
  if (IoOverlaySingleton.expanded) {
    for (let i = options.length; i--;) {
      if (isPointerAboveIoOption(event, options[i])) hovered.push(options[i])
    }
  }
  if (hovered.length) {
    hovered.sort((a: IoMenuElementType, b: IoMenuElementType) => {
      const aDepth = (a as MenuDOMNode).depth
      const bDepth = (b as MenuDOMNode).depth
      if (aDepth !== undefined && bDepth !== undefined) {
        if (aDepth > bDepth) return 1
        if (aDepth < bDepth) return -1
      }
      if (a.localName === 'io-option') return 1
      if (b.localName === 'io-option') return -1
      return 0
    })
    const first = hovered[0]
    const second = hovered[1]
    if (first.localName === 'io-option') {
      return first
    // NOTE: This effectively blocks picking io-option behind io-menu.
    } else if (first.localName === 'io-menu' && second) {
      if (second.localName === 'io-option' && (second as MenuDOMNode).depth === (first as MenuDOMNode).depth) {
        return second
      }
    }
  }
  return undefined
}

export function getMenuDescendants(element: IoMenuElementType) {
  const descendants: IoMenuElementType[] = []
  const menuElement = element as MenuDOMNode
  if (menuElement.$menu) {
    descendants.push(menuElement.$menu)
    const options = menuElement.$menu.querySelectorAll(MenuElementTagsSelector)
    for (let i = options.length; i--;) {
      descendants.push(options[i] as IoMenuElementType)
      descendants.push(...getMenuDescendants(options[i] as IoMenuElementType))
    }
  } else {
    const options = Array.from(element.querySelectorAll(MenuElementTagsSelector)) as IoMenuElementType[]
    for (let i = options.length; i--;) {
      descendants.push(options[i])
      descendants.push(...getMenuDescendants(options[i]))
    }
  }
  return descendants
}

export function getMenuAncestors(element: IoMenuElementType) {
  const ancestors: IoMenuElementType[] = []
  let option = element
  while (option && (option as MenuDOMNode).$parent) {
    option = (option as MenuDOMNode).$parent!
    if (option) ancestors.push(option)
  }
  return ancestors
}

export function getMenuChildren(element: IoMenuElementType) {
  const children: IoMenuElementType[] = []
  const options = Array.from(element.querySelectorAll(MenuElementTagsSelector)) as IoMenuElementType[]
  for (let i = options.length; i--;) {
    children.push(options[i])
  }
  const menuElement = element as MenuDOMNode
  if (menuElement.$menu) {
    children.push(menuElement.$menu)
    const options = menuElement.$menu.querySelectorAll(MenuElementTagsSelector)
    for (let i = options.length; i--;) {
      children.push(options[i] as IoMenuElementType)
    }
  }
  return children
}

export function getMenuSiblings(element: IoOption) {
  const siblings: IoOption[] = []
  const parent = element.parentElement
  if (parent) {
    siblings.push(...Array.from(parent.querySelectorAll(MenuElementTagsSelector)) as IoOption[])
  }
  return siblings
}

export function getMenuRoot(element: IoMenuElementType) {
  let root: IoMenuElementType = element
  while (root && (root as MenuDOMNode).$parent) {
    root = (root as MenuDOMNode).$parent!
  }
  return root
}

export function isPointerAboveIoOption(event: PointerEvent, element: IoMenuElementType) {
  if (MenuElementTags.indexOf(element.localName) !== -1) {
    if (!(element as MenuDOMNode).disabled) {
      if (element.parentElement !== IoOverlaySingleton && (element.parentElement as MenuDOMNode).expanded) {
        const r = element.getBoundingClientRect()
        const x = event.clientX
        const y = event.clientY
        const hovered = (r.top <= y && r.bottom >= y && r.left <= x && r.right >= x )
        return hovered
      }
    }
  }
  return false
}

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoBreadcrumbs, IoContextEditorSingleton } from '@io-gui/editors'
import { IoPropertyLink } from './IoPropertyLink.js'

class NamedNode {
  name = 'root'
  constructor(public id: string) {}
}

describe('IoPropertyLink', () => {
  let element: IoPropertyLink
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    element = new IoPropertyLink({ value: new NamedNode('n1'), showName: true })
    container.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    container.remove()
  })

  it('renders constructor name and optional name', () => {
    expect(element.textContent).toContain('NamedNode')
    expect(element.textContent).toContain('root')
  })

  it('updates label when value mutates', () => {
    const next = new NamedNode('n2')
    next.name = 'child'
    element.value = next
    element.valueMutated()
    expect(element.textContent).toContain('child')
  })
})

describe('IoBreadcrumbs', () => {
  let element: IoBreadcrumbs
  let container: HTMLElement
  let nodes: NamedNode[]

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    nodes = [new NamedNode('a'), new NamedNode('b'), new NamedNode('c')]
    element = new IoBreadcrumbs({ value: nodes[0] })
    element.selected = nodes[1]
    element.selected = nodes[2]
    container.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    container.remove()
  })

  it('renders property links for breadcrumb trail', () => {
    const links = element.querySelectorAll('io-property-link')
    expect(links.length).toBe(2)
  })

  it('does not reflect search attribute by default', () => {
    expect(element.hasAttribute('search')).toBe(false)
  })
})

describe('IoContextEditorSingleton', () => {
  let source: HTMLElement

  beforeEach(() => {
    source = document.createElement('div')
    source.style.cssText = 'position:fixed;top:10px;left:10px;width:50px;height:50px'
    document.body.appendChild(source)
    IoContextEditorSingleton.expanded = false
  })

  afterEach(() => {
    source.remove()
    IoContextEditorSingleton.expanded = false
  })

  it('expands with value and properties', () => {
    IoContextEditorSingleton.expand({
      source,
      direction: 'right',
      value: { foo: 1 },
      properties: ['foo'],
    })
    expect(IoContextEditorSingleton.expanded).toBe(true)
    expect(IoContextEditorSingleton.value).toEqual({ foo: 1 })
  })

  it('clears state when collapsed', () => {
    IoContextEditorSingleton.expand({
      source,
      direction: 'right',
      value: { foo: 1 },
      properties: ['foo'],
    })
    IoContextEditorSingleton.expanded = false
    expect(IoContextEditorSingleton.value).toEqual({})
    expect(IoContextEditorSingleton.properties).toEqual([])
  })
})

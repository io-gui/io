import { describe, it, expect } from 'vitest'
import { Menu } from '@io-gui/menus'

const foodMenuArgs = {
  id: 'root',
  options: [
    {id: 'home'},
    {id: 'food', options: [
      {id: 'fruits', options: [
        {id: 'apples'},
        {id: 'mangos'},
        {id: 'bananas'},
      ]}
    ]},
  ],
}

describe('Menu', () => {
  it('Should initialize with correct default values', () => {
    const menu = new Menu({id: 'test'})
    expect(menu.id).toBe('test')
    expect(menu.selectedID).toBe('')
    expect(menu.path).toBe('')
    expect(menu.expandedIDs).toBe('')
  })
  it('Should update path and selectedID when options are selected', () => {
    const menu = new Menu({id: 'optionsview', options: [
      {id: 'home'},
      {id: 'food', options: [
        {id: 'fruits', options: [
          {id: 'apples', selected: true},
          {id: 'mangos'},
          {id: 'bannanas'},
        ]}
      ]},
      {id: 'mixed', options: [
        {id: 'togglables', mode: 'none', options: [
          {id: 'toggle1', mode: 'toggle'},
          {id: 'toggle2', mode: 'toggle'},
          {id: 'toggle3', mode: 'toggle'},
          {id: 'toggle4', mode: 'toggle'},
        ]},
        {id: 'selectables', options: [
          {id: 'toggle', mode: 'toggle'},
          {id: 'selectable'},
        ]},
      ]},
    ]})
    expect(menu.selected).toBe(true)
    expect(menu.options[1].selected).toBe(true)
    expect(menu.options[1].options[0].selected).toBe(true)
    expect(menu.options[1].options[0].options[0].selected).toBe(true)
    expect(menu.selectedID).toBe('apples')
    expect(menu.selectedIDImmediate).toBe('food')
    expect(menu.path).toBe('food,fruits,apples')
    expect(menu.options[1].selectedIDImmediate).toBe('fruits')
    expect(menu.options[1].options[0].selectedIDImmediate).toBe('apples')

    menu.options[1].options[0].options[0].selected = false

    expect(menu.options[1].options[0].selectedIDImmediate).toBe('')
    expect(menu.selectedID).toBe('fruits')
    expect(menu.selectedIDImmediate).toBe('food')
    expect(menu.path).toBe('food,fruits')
    expect(menu.options[1].selectedIDImmediate).toBe('fruits')

    menu.options[0].selected = true

    expect(menu.selected).toBe(true)
    expect(menu.options[1].selected).toBe(false)
    expect(menu.options[1].options[0].selected).toBe(false)
    expect(menu.options[1].options[0].options[0].selected).toBe(false)
    expect(menu.selectedID).toBe('home')
    expect(menu.selectedIDImmediate).toBe('home')
    expect(menu.path).toBe('home')
    expect(menu.options[1].selectedIDImmediate).toBe('')
    expect(menu.options[1].options[0].selectedIDImmediate).toBe('')
  })
  it('Should select options when selectedID is written', () => {
    const menu = new Menu({id: 'root', options: [
      {id: '1', options: [{id: '1.1'}, {id: '1.2'}]},
      {id: '2', options: [{id: '2.1'}, {id: '2.2'}]},
    ]})
    menu.selectedID = '1.1'
    expect(menu.options[0].selected).toBe(true)
    expect(menu.options[0].options[0].selected).toBe(true)
    expect(menu.path).toBe('1,1.1')

    menu.selectedID = '2.1'
    expect(menu.options[0].selected).toBe(false)
    expect(menu.options[0].selectedIDImmediate).toBe('')
    expect(menu.options[1].selected).toBe(true)
    expect(menu.options[1].selectedIDImmediate).toBe('2.1')
    expect(menu.path).toBe('2,2.1')
  })
  it('Should unselect all when selectedID matches no option', () => {
    const menu = new Menu({id: 'root', options: [
      {id: '1', options: [{id: '1.1'}]},
    ]})
    menu.selectedID = '1.1'
    expect(menu.options[0].selected).toBe(true)

    menu.selectedID = 'nonexistent'
    expect(menu.options[0].selected).toBe(false)
    expect(menu.options[0].options[0].selected).toBe(false)
    expect(menu.selectedID).toBe('')
    expect(menu.path).toBe('')
  })
  it('Should initialize selection from path in constructor arguments', () => {
    const menu = new Menu({...foodMenuArgs, path: 'food,fruits,apples'})

    expect(menu.selected).toBe(true)
    expect(menu.path).toBe('food,fruits,apples')
    expect(menu.selectedID).toBe('apples')
    expect(menu.selectedIDImmediate).toBe('food')
    expect(menu.options[1].options[0].options[0].selected).toBe(true)
  })
  it('Should update paths when selecting sibling after path-based initialization', () => {
    const menu = new Menu({...foodMenuArgs, path: 'food,fruits,apples'})

    const rootPathChanges: string[] = []
    menu.addEventListener('path-changed', (e: CustomEvent) => {
      rootPathChanges.push(e.detail.value)
    })

    const mangos = menu.findOptionById('mangos')!
    mangos.selected = true

    expect(menu.path).toBe('food,fruits,mangos')
    expect(menu.selectedID).toBe('mangos')
    expect(rootPathChanges).toContain('food,fruits,mangos')
  })
  it('Should select deepest valid ancestor when path leaf is invalid', () => {
    const menu = new Menu({...foodMenuArgs, path: 'food,fruits,misspelled'})

    expect(menu.selected).toBe(true)
    expect(menu.selectedIDImmediate).toBe('food')
    expect(menu.options[1].selected).toBe(true)
    expect(menu.options[1].options[0].selected).toBe(true)
    expect(menu.options[1].options[0].selectedIDImmediate).toBe('')
    expect(menu.path).toBe('food,fruits')
  })
  it('Should resolve full path when an intermediate segment is invalid', () => {
    const menu = new Menu({...foodMenuArgs, path: 'food,misspelled,mangos'})

    expect(menu.selected).toBe(true)
    expect(menu.path).toBe('food,fruits,mangos')
    expect(menu.options[1].options[0].selectedIDImmediate).toBe('mangos')
  })
  it('Should not select anything when no path segment is valid', () => {
    const menu = new Menu({id: 'root', options: [
      {id: 'home'},
      {id: 'food', options: [
        {id: 'fruits'},
      ]},
    ], path: 'wrong,nope'})

    expect(menu.selected).toBe(false)
    expect(menu.selectedID).toBe('')
  })
  it('Should update selectedID when selecting an option with empty id', () => {
    const menu = new Menu({
      options: [
        {id: '', label: 'all', value: ''},
        {id: 'animals', label: 'animals'},
        {id: 'nature', label: 'nature'},
      ],
    })

    menu.options[1].selected = true
    expect(menu.selectedID).toBe('animals')
    expect(menu.selectedIDImmediate).toBe('animals')

    menu.options[0].selected = true
    expect(menu.selectedID).toBe('')
    expect(menu.selectedIDImmediate).toBe('')
    expect(menu.options[0].selected).toBe(true)
    expect(menu.options[1].selected).toBe(false)
  })
  it('Should update selection when selectedID is set to empty string externally', () => {
    const menu = new Menu({
      options: [
        {id: '', label: 'all', value: ''},
        {id: 'animals', label: 'animals'},
      ],
    })

    menu.options[1].selected = true
    menu.selectedID = ''

    expect(menu.options[0].selected).toBe(true)
    expect(menu.options[1].selected).toBe(false)
  })
  it('Should recover selected flag from child selection in optionsMutated', () => {
    const menu = new Menu({id: 'root', options: [
      {id: '1', options: [{id: '1.1'}, {id: '1.2'}]},
      {id: '2', options: [{id: '2.1'}, {id: '2.2'}]},
    ]})

    menu.options[0].selected = true
    menu.options[0].options[0].selected = true

    // Simulate an edge case where selected became false but a child is still selected.
    const selectedProp = (menu as any)._properties.get('selected')!
    selectedProp.value = false

    const pathChanges: string[] = []
    menu.addEventListener('path-changed', (e: CustomEvent) => {
      pathChanges.push(e.detail.value)
    })

    menu.options[0].options[1].selected = true

    expect(menu.selected).toBe(true)
    expect(menu.path).toBe('1,1.2')
    expect(pathChanges).toContain('1,1.2')
  })
  it('Should track disclosure state via expandedIDs', () => {
    const menu = new Menu(foodMenuArgs)
    expect(menu.getDisclosed()).toEqual([])
    expect(menu.isDisclosed('food')).toBe(false)

    menu.setDisclosed('food', true)
    expect(menu.expandedIDs).toBe('food')
    expect(menu.isDisclosed('food')).toBe(true)

    menu.setDisclosed('fruits', true)
    expect(menu.expandedIDs).toBe('food,fruits')

    menu.setDisclosed('food', false)
    expect(menu.expandedIDs).toBe('fruits')
    expect(menu.isDisclosed('food')).toBe(false)
    expect(menu.isDisclosed('fruits')).toBe(true)

    // No-op writes do not touch the property.
    menu.setDisclosed('fruits', true)
    expect(menu.expandedIDs).toBe('fruits')
  })
})

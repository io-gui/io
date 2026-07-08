import { describe, it, expect } from 'vitest'
import { NodeArray } from '@io-gui/core'
import { Option } from '@io-gui/menus'

const testOptionArgs = {
  id: 'root',
  options: [
    {id: '1', label: 'one', options: [
      {id: '1.1', label: 'one.1'},
      {id: '1.2', label: 'one.2'},
    ]},
    {id: '2', label: 'two', options: [
      {id: '2.1', label: 'two.1'},
      {id: '2.2', label: 'two.2'},
    ]},
  ]
}

describe('Option', () => {
  it('Should initialize with correct default values', () => {
    const option = new Option({id: 'test'})
    expect(option.value).toBe('test')
    expect(option.id).toBe('test')
    expect(option.label).toBe('test')
    expect(option.icon).toBe('')
    expect(option.hint).toBe('')
    expect(option.disabled).toBe(false)
    expect(option.action).toBe(undefined)
    expect(option.mode).toBe('select')
    expect(option.selected).toBe(false)
    expect(option.selectedIDImmediate).toBe('')
    expect(option.options).toBeInstanceOf(NodeArray)
    expect(option.options.length).toBe(0)
  })
  it('Should initialize from primitive shorthand', () => {
    const fromString = new Option('foo')
    expect(fromString.id).toBe('foo')
    expect(fromString.value).toBe('foo')
    expect(fromString.label).toBe('foo')

    const fromNumber = new Option(2)
    expect(fromNumber.id).toBe('2')
    expect(fromNumber.value).toBe(2)
    expect(fromNumber.label).toBe('2')

    const fromNull = new Option(null)
    expect(fromNull.id).toBe('null')
    expect(fromNull.value).toBe(null)
  })
  it('Should infer mode "none" when action is provided without explicit mode', () => {
    const command = new Option({id: 'cmd', action: () => {}})
    expect(command.mode).toBe('none')

    const explicit = new Option({id: 'cmd2', action: () => {}, mode: 'select'})
    expect(explicit.mode).toBe('select')
  })
  it('Should initialize correctly from constructor arguments', () => {
    const option = new Option({
      value: 1,
      id: 'one',
      label: 'onelabel',
      icon: 'icon:close',
      hint: 'onehint',
      disabled: true,
      action: ()=>{},
      mode: 'select',
      options: [
        {id: 'two', value: 2, label: 'twolabel', selected: true},
        {id: 'three', value: 3, label: 'threelabel', mode: 'toggle', selected: true},
        {id: 'four', value: 4, label: 'fourlabel', selected: true},
      ]
    })
    expect(option.value).toBe(1)
    expect(option.id).toBe('one')
    expect(option.label).toBe('onelabel')
    expect(option.icon).toBe('icon:close')
    expect(option.hint).toBe('onehint')
    expect(option.disabled).toBe(true)
    expect(typeof option.action).toBe('function')
    expect(option.mode).toBe('select')
    expect(option.selected).toBe(true)
    expect(option.selectedIDImmediate).toBe('two')
    expect(option.options).toBeInstanceOf(NodeArray)
    expect(option.options.length).toBe(3)
    expect(option.options[0].id).toBe('two')
    expect(option.options[0].value).toBe(2)
    expect(option.options[0].label).toBe('twolabel')
    expect(option.options[0].selected).toBe(true)
    expect(option.options[1].id).toBe('three')
    expect(option.options[1].value).toBe(3)
    expect(option.options[1].label).toBe('threelabel')
    expect(option.options[1].selected).toBe(true)
    expect(option.options[1].mode).toBe('toggle')
    // Duplicate-selected repair: the first select-mode selected child wins.
    expect(option.options[2].id).toBe('four')
    expect(option.options[2].value).toBe(4)
    expect(option.options[2].label).toBe('fourlabel')
    expect(option.options[2].selected).toBe(false)
    expect(option.options[2].mode).toBe('select')
  })
  it('Should initialize suboptions from constructor arguments', () => {
    const option = new Option(testOptionArgs)
    expect(option.options).toBeInstanceOf(NodeArray)
    expect(option.options.length).toBe(2)
    expect(option.options[0].options).toBeInstanceOf(NodeArray)
    expect(option.options[0].options.length).toBe(2)
    expect(option.options[1].options).toBeInstanceOf(NodeArray)
    expect(option.options[1].options.length).toBe(2)
  })
  it('Should select default branch when `selectDefault` is called', () => {
    const option = new Option(testOptionArgs)
    option.selectDefault()
    expect(option.selected).toBe(true)
    expect(option.options[0].selected).toBe(true)
    expect(option.options[1].selected).toBe(false)
    expect(option.options[0].options[0].selected).toBe(true)
    expect(option.options[0].options[1].selected).toBe(false)
    expect(option.options[1].options[0].selected).toBe(false)
    expect(option.options[1].options[1].selected).toBe(false)
  })
  it('Should update selectedIDImmediate when selection changes', () => {
    const option = new Option(testOptionArgs)
    option.selectDefault()
    expect(option.selectedIDImmediate).toBe('1')
    expect(option.options[0].selectedIDImmediate).toBe('1.1')
    expect(option.options[1].selectedIDImmediate).toBe('')

    option.options[1].options[1].selected = true
    expect(option.selectedIDImmediate).toBe('2')
    expect(option.options[0].selectedIDImmediate).toBe('')
    expect(option.options[1].selectedIDImmediate).toBe('2.2')
  })
  it('Should enforce selection scope: selecting a sibling deselects other select-mode siblings', () => {
    const option = new Option({id: 'root', options: [
      {id: 'toggle', mode: 'toggle'},
      {id: 'a'},
      {id: 'b'},
    ]})
    option.options[0].selected = true
    option.options[1].selected = true
    expect(option.options[1].selected).toBe(true)

    option.options[2].selected = true
    expect(option.options[1].selected).toBe(false)
    expect(option.options[2].selected).toBe(true)
    // Toggle-mode siblings are outside the selection scope.
    expect(option.options[0].selected).toBe(true)
  })
  it('Should unselect suboptions when deselected', () => {
    const option = new Option(testOptionArgs)
    option.selectDefault()
    expect(option.options[0].options[0].selected).toBe(true)

    option.options[0].selected = false
    expect(option.options[0].options[0].selected).toBe(false)
    expect(option.selectedIDImmediate).toBe('')
  })
  it('Should find child option before root when ids match', () => {
    const option = new Option({
      options: [{id: '', label: 'all', value: ''}],
    })
    expect(option.findOptionById('')).toBe(option.options[0])
  })
  it('Should find options by value', () => {
    const option = new Option({id: 'root', options: [
      {id: 'one', value: 1},
      {id: 'two', value: 2, options: [{id: 'three', value: 3}]},
    ]})
    expect(option.findOptionByValue(1)).toBe(option.options[0])
    expect(option.findOptionByValue(3)).toBe(option.options[1].options[0])
    expect(option.findOptionByValue(42)).toBe(undefined)
  })
  it('Should serialize structure only — no selection state', () => {
    const option = new Option(testOptionArgs)
    option.selectDefault()

    const json = option.toJSON() as any
    expect(json.id).toBe('root')
    expect(json.options.length).toBe(2)
    expect('selected' in json).toBe(false)
    expect('selected' in json.options[0]).toBe(false)

    const restored = new Option({}).fromJSON({...json, selected: true} as any)
    expect(restored.id).toBe('root')
    expect(restored.options.length).toBe(2)
    expect(restored.selected).toBe(false)
    expect(restored.options[0].selected).toBe(false)
  })
})

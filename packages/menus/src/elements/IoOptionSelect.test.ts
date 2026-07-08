import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoOptionSelect, Menu } from '@io-gui/menus'

describe('IoOptionSelect', () => {
  let model: Menu
  let element: IoOptionSelect

  beforeEach(() => {
    model = new Menu({
      id: 'root',
      options: [
        { id: 'one', value: 1, label: 'One' },
        { id: 'two', value: 2, label: 'Two' },
      ],
    })
    element = new IoOptionSelect({ model })
    document.body.appendChild(element as HTMLElement)
    element.style.display = 'none'
  })

  afterEach(() => {
    element.remove()
    model.dispose()
  })

  it('selects the matching option when value is written', () => {
    element.value = 2
    expect(model.findOptionById('two')!.selected).toBe(true)
    expect(model.selectedID).toBe('two')
    expect(element.textContent).toContain('Two')
  })

  it('mirrors the selected option value when selection changes on the model', () => {
    model.findOptionById('one')!.selected = true
    expect(element.value).toBe(1)
    expect(element.textContent).toContain('One')
  })

  it('takes the initially selected option value when value is undefined', () => {
    const preselected = new Menu({
      id: 'root',
      options: [
        { id: 'one', value: 1, label: 'One' },
        { id: 'two', value: 2, label: 'Two' },
      ],
      // NOTE: selection entry points apply in arg order — options must come first.
      selectedID: 'two',
    })
    const select = new IoOptionSelect({ model: preselected })
    document.body.appendChild(select as HTMLElement)
    select.style.display = 'none'
    expect(select.value).toBe(2)
    select.remove()
    preselected.dispose()
  })

  it('falls back to String(value) label when value matches no option', () => {
    element.value = 42
    expect(element.textContent).toContain('42')
  })
})

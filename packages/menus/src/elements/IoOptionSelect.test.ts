import { describe, it, expect } from 'vitest'
import { IoOptionSelect, MenuOption } from '@io-gui/menus'

const element = new IoOptionSelect({value: '', option: new MenuOption({id: 'test', options: []})})
document.body.appendChild(element as HTMLElement)
element.style.display = 'none'

describe('IoOptionSelect', () => {
  it('has default values', () => {
  })
  it('matches values', () => {
    expect(element.textContent).toBe('')
    element.value = 2
  })
  it('has tabIndex attribute', () => {
  })
  it('has a11y attributes', () => {
  })
})

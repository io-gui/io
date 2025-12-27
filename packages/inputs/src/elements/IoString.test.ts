import { describe, it, expect } from 'vitest'
import { IoString } from '@io-gui/inputs'

const element = new IoString()
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

describe('IoString.test', () => {
  it('has default values', () => {
    expect(element.value).toBe('')
  })
  it('matches values', () => {
    element.value = 'hello'
    expect(element.textContent).toBe('hello');
    (element as any).value = false
    expect(element.textContent).toBe('');
    (element as any).value = null
    expect(element.textContent).toBe('');
    (element as any).value = undefined
    expect(element.textContent).toBe('');
    (element as any).value = NaN
    expect(element.textContent).toBe('');
    (element as any).value = 123
    expect(element.textContent).toBe('123')
    element.value = ''
  })
  it('has tabIndex attribute', () => {
    expect(element.getAttribute('tabIndex')).toBe('0')
  })
  it('has contenteditable attribute', () => {
    expect(element.getAttribute('contenteditable')).toBe('true')
  })
  it('has a11y attributes', () => {
    expect(element.getAttribute('role')).toBe('textbox');
    (element as any).value = 0
    expect(element.getAttribute('aria-invalid')).toBe('true')
    element.value = ''
    expect(element.getAttribute('aria-invalid')).toBe(null)
  })
  it('has title attribute', () => {
    element.title = 'Enter text'
    expect(element.getAttribute('title')).toBe('Enter text')
    element.title = ''
  })
})

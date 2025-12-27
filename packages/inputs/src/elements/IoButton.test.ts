import { describe, it, expect } from 'vitest'
import { IconsetSingleton } from '@io-gui/icons'
import { IoButton } from '@io-gui/inputs'

const element = new IoButton()
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

describe('IoButton.test', () => {
  it('Should initialize properties correctly', () => {
    expect(element.action).toBe(undefined)
    expect(element.value).toBe(undefined)
  })
  it('has correct default attributes', () => {
    expect(element.getAttribute('role')).toBe('button')
    expect(element.getAttribute('pressed')).toBe(null)
    expect(element.getAttribute('aria-pressed')).toBe('false')
  })
  it('has correct default innerHTML', () => {
    expect(element.innerHTML).toBe('')
  })
  it('should set innerText to match label property', () => {
    expect(element.innerText).toBe('')
    element.label = 'click me'
    expect(element.innerText).toBe('click me')
    element.label = ''
  })
  it('should set icon to match icon property', () => {
    element.icon = 'io:io_logo'
    expect(element.innerHTML).toBe(`<io-icon size="small" value="${element.icon}">${IconsetSingleton.getIcon(element.icon)}</io-icon>`)
    element.icon = ''
    expect(element.innerHTML).toBe('')
  })
  it('has reactive attributes', () => {
    element.pressed = false
    expect(element.getAttribute('aria-pressed')).toBe('false')
    element.pressed = true
    expect(element.getAttribute('aria-pressed')).toBe('true')
    element.pressed = false
  })
})

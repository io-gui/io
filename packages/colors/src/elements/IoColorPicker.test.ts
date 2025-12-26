import { describe, it, expect } from 'vitest'
import { IoColorPicker } from '@io-gui/colors'

const element = new IoColorPicker()
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

describe('IoColorPicker.test', () => {
  it('Should be defined', () => {
    expect(IoColorPicker).toBeDefined()
  })
})

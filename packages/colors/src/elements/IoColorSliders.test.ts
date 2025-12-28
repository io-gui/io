import { describe, it, expect } from 'vitest'
import { IoColorSlider } from '@io-gui/colors'

const element = new IoColorSlider()
element.style.display = 'none'
document.body.appendChild(element as HTMLElement)

describe('IoColorSliders.test', () => {
  it('Should be defined', () => {
    expect(IoColorSlider).toBeDefined()
  })
})

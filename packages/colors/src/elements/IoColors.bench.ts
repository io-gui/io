import { describe } from 'vitest'
import {
  benchFreshVsCached,
  benchInitialRender,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { IoColorRgba, IoColorSlider } from '@io-gui/colors'

describe('IoColorRgba', () => {
  const color = { r: 0.2, g: 0.4, b: 0.6, a: 1 }

  benchInitialRender('rgba channels', (mount) => {
    const el = new IoColorRgba({ value: { r: 0.2, g: 0.4, b: 0.6, a: 1 } })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyColor = new IoColorRgba({ value: color })
  warmElement(steadyColor, () => steadyColor.changed())

  benchFreshVsCached({
    label: 'channel value change',
    fresh: () => {
      color.r = color.r === 0.2 ? 0.25 : 0.2
      steadyColor.changed()
    },
  })
})

describe('IoColorSliders', () => {
  const color = { r: 0.5, g: 0.5, b: 0.5, a: 1 }

  benchInitialRender('color slider', (mount) => {
    const el = new IoColorSlider({ value: { r: 0.5, g: 0.5, b: 0.5, a: 1 }, channel: 'h' })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadySlider = new IoColorSlider({ value: color, channel: 'h' })
  warmElement(steadySlider, () => steadySlider.changed())

  benchFreshVsCached({
    label: 'channel switch + value',
    fresh: () => {
      steadySlider.channel = steadySlider.channel === 'h' ? 's' : 'h'
      color.r = color.r === 0.5 ? 0.55 : 0.5
      steadySlider.changed()
    },
  })
})

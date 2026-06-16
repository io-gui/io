import { describe } from 'vitest'
import {
  benchFreshVsCached,
  benchInitialRender,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { IoNumberSlider, IoNumberSliderRange } from '@io-gui/sliders'

describe('IoNumberSlider', () => {
  benchInitialRender('number slider', (mount) => {
    const el = new IoNumberSlider({ value: 0.5, min: 0, max: 1 })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadySlider = new IoNumberSlider({ value: 0.5, min: 0, max: 1 })
  warmElement(steadySlider, () => steadySlider.changed())

  benchFreshVsCached({
    label: 'value drag simulation',
    fresh: () => {
      steadySlider.value = steadySlider.value === 0.5 ? 0.55 : 0.5
      steadySlider.changed()
    },
  })
})

describe('IoNumberSliderRange', () => {
  const range: [number, number] = [0.2, 0.8]

  benchInitialRender('number slider range', (mount) => {
    const el = new IoNumberSliderRange({ value: [0.2, 0.8], min: 0, max: 1 })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyRange = new IoNumberSliderRange({ value: range, min: 0, max: 1 })
  warmElement(steadyRange, () => steadyRange.changed())

  benchFreshVsCached({
    label: 'range value mutation',
    fresh: () => {
      range[0] = range[0] === 0.2 ? 0.25 : 0.2
      steadyRange.changed()
    },
  })
})

import { describe } from 'vitest'
import {
  benchFreshVsCached,
  benchInitialRender,
  warmElement,
} from '../../../core/src/testing/bench-render.js'
import { IoSwitch, IoField, IoButton } from '@io-gui/inputs'

describe('IoSwitch', () => {
  benchInitialRender('switch', (mount) => {
    const el = new IoSwitch({ value: false })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadySwitch = new IoSwitch({ value: false })
  warmElement(steadySwitch, () => steadySwitch.changed())

  benchFreshVsCached({
    label: 'toggle',
    fresh: () => {
      steadySwitch.value = !steadySwitch.value
      steadySwitch.changed()
    },
  })
})

describe('IoField', () => {
  benchInitialRender('field text', (mount) => {
    const el = new IoField({ value: 'hello', label: 'Name' })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyField = new IoField({ value: 'hello', label: 'Name' })
  warmElement(steadyField, () => steadyField.changed())

  benchFreshVsCached({
    label: 'value text',
    fresh: () => {
      steadyField.value = steadyField.value === 'hello' ? 'world' : 'hello'
      steadyField.changed()
    },
  })
})

describe('IoButton', () => {
  benchInitialRender('button', (mount) => {
    const el = new IoButton({ label: 'Run', icon: 'io:play' })
    mount(el)
    el.changed()
    el.dispose()
  })

  const steadyButton = new IoButton({ label: 'Run', icon: 'io:play' })
  warmElement(steadyButton, () => steadyButton.changed())

  benchFreshVsCached({
    label: 'pressed state',
    fresh: () => {
      steadyButton.pressed = !steadyButton.pressed
      steadyButton.changed()
    },
  })
})

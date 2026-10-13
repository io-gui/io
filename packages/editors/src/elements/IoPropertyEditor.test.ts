//@ts-nocheck
import { describe, it, expect } from 'vitest'
import { nextFrame } from '@io-gui/core'
import { IoPropertyEditor } from '@io-gui/editors'

const element = new IoPropertyEditor()
element.style.display = 'none'
element.labeled = true
element.value = {}
element.config = new Map()
element.properties = []
document.body.appendChild(element as HTMLElement)

function reset() {
  element.labeled = true
  element.value = {}
  element.config = new Map()
  element.properties = []
}

describe('io-property-editor.test', () => {
  it('has default values', () => {
    expect(element.labeled).toBe(true)
    expect(JSON.stringify(element.value)).toBe(JSON.stringify({}))
    expect(JSON.stringify(element.properties)).toBe(JSON.stringify([]))
    expect(JSON.stringify(element.config)).toBe(JSON.stringify({}))
  })
  it('matches values', async () => {
    reset()
  })
  it('does not sync a new value into editors built for the previous value', async () => {
    reset()
    const previous = {object: {a: 1}}
    element.value = previous
    await nextFrame()
    const field = element.querySelector('io-object')
    expect(field.value).toBe(previous.object)
    // A mutation right after the switch syncs before the editors are rebuilt for the new value.
    element.value = {object: undefined}
    element.changedThrottled()
    expect(field.value).toBe(previous.object)
  })
})

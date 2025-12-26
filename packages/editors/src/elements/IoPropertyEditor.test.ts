//@ts-nocheck
import { describe, it, expect } from 'vitest'
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
})

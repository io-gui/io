import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Tab, TabProps } from './Tab.js'

describe('Tab', () => {

  describe('Construction', () => {

    it('should construct with minimal props (id only)', () => {
      const tab = new Tab({ id: 'test-tab' })

      expect(tab.id).toBe('test-tab')
      expect(tab.label).toBe('test-tab') // label defaults to id
      expect(tab.icon).toBe('')
      expect(tab.selected).toBe(false)
    })

    it('should construct with all props', () => {
      const tab = new Tab({
        id: 'my-tab',
        label: 'My Tab Label',
        icon: 'icon-star',
        selected: true
      })

      expect(tab.id).toBe('my-tab')
      expect(tab.label).toBe('My Tab Label')
      expect(tab.icon).toBe('icon-star')
      expect(tab.selected).toBe(true)
    })

    it('should default label to id when label is undefined', () => {
      const tab = new Tab({ id: 'auto-label' })
      expect(tab.label).toBe('auto-label')
    })

    it('should use explicit label when provided', () => {
      const tab = new Tab({ id: 'tab-id', label: 'Custom Label' })
      expect(tab.label).toBe('Custom Label')
    })

    it('should handle empty string label (uses id)', () => {
      const tab = new Tab({ id: 'fallback-label', label: '' })
      expect(tab.label).toBe('fallback-label')
    })

    it('should default selected to false', () => {
      const tab = new Tab({ id: 'unselected' })
      expect(tab.selected).toBe(false)
    })

    it('should accept selected: true', () => {
      const tab = new Tab({ id: 'selected', selected: true })
      expect(tab.selected).toBe(true)
    })

    it('should handle special characters in id', () => {
      const tab = new Tab({ id: 'tab/with:special-chars_123' })
      expect(tab.id).toBe('tab/with:special-chars_123')
    })

    it('should handle unicode in label', () => {
      const tab = new Tab({ id: 'unicode', label: '日本語タブ 🎉' })
      expect(tab.label).toBe('日本語タブ 🎉')
    })

  })

  describe('Property Changes', () => {

    it('should allow changing id', () => {
      const tab = new Tab({ id: 'original' })
      tab.id = 'updated'
      expect(tab.id).toBe('updated')
    })

    it('should allow changing label', () => {
      const tab = new Tab({ id: 'test' })
      tab.label = 'New Label'
      expect(tab.label).toBe('New Label')
    })

    it('should allow changing icon', () => {
      const tab = new Tab({ id: 'test' })
      tab.icon = 'new-icon'
      expect(tab.icon).toBe('new-icon')
    })

    it('should allow toggling selected', () => {
      const tab = new Tab({ id: 'test' })
      expect(tab.selected).toBe(false)

      tab.selected = true
      expect(tab.selected).toBe(true)

      tab.selected = false
      expect(tab.selected).toBe(false)
    })

  })

  describe('Change Events', () => {
    let tab: Tab
    let handler: ReturnType<typeof vi.fn> & EventListener

    beforeEach(() => {
      tab = new Tab({ id: 'event-test', label: 'Initial' })
      handler = vi.fn() as ReturnType<typeof vi.fn> & EventListener
    })

    afterEach(() => {
      tab.dispose()
    })

    it('should dispatch id-changed event', () => {
      tab.addEventListener('id-changed', handler)
      tab.id = 'new-id'

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.value).toBe('new-id')
      expect(handler.mock.calls[0][0].detail.oldValue).toBe('event-test')
    })

    it('should dispatch label-changed event', () => {
      tab.addEventListener('label-changed', handler)
      tab.label = 'New Label'

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.value).toBe('New Label')
      expect(handler.mock.calls[0][0].detail.oldValue).toBe('Initial')
    })

    it('should dispatch icon-changed event', () => {
      tab.addEventListener('icon-changed', handler)
      tab.icon = 'new-icon'

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.value).toBe('new-icon')
      expect(handler.mock.calls[0][0].detail.oldValue).toBe('')
    })

    it('should dispatch selected-changed event', () => {
      tab.addEventListener('selected-changed', handler)
      tab.selected = true

      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.value).toBe(true)
      expect(handler.mock.calls[0][0].detail.oldValue).toBe(false)
    })

    it('should not dispatch event when value unchanged', () => {
      tab.addEventListener('id-changed', handler)
      tab.id = 'event-test' // same value

      expect(handler).not.toHaveBeenCalled()
    })

  })

  describe('Serialization - toJSON', () => {

    it('should serialize all properties', () => {
      const tab = new Tab({
        id: 'serialize-test',
        label: 'Serialize Label',
        icon: 'serialize-icon',
        selected: true
      })

      const json = tab.toJSON()

      expect(json).toEqual({
        id: 'serialize-test',
        label: 'Serialize Label',
        icon: 'serialize-icon',
        selected: true
      })
    })

    it('should omit default values for compact serialization', () => {
      const tab = new Tab({ id: 'minimal' })
      const json = tab.toJSON()

      // Only id is serialized when all others are defaults
      // (label equals id, icon is empty, selected is false)
      expect(json).toEqual({ id: 'minimal' })
      expect(json.label).toBeUndefined()
      expect(json.icon).toBeUndefined()
      expect(json.selected).toBeUndefined()
    })

    it('should include label only when different from id', () => {
      const tab = new Tab({ id: 'test', label: 'Custom Label' })
      const json = tab.toJSON()

      expect(json).toEqual({ id: 'test', label: 'Custom Label' })

      tab.label = 'test'
      const json2 = tab.toJSON()

      expect(json2).toEqual({ id: 'test' })
    })

    it('should produce plain object (not Tab instance)', () => {
      const tab = new Tab({ id: 'test' })
      const json = tab.toJSON()

      expect(json).not.toBeInstanceOf(Tab)
      expect(json.constructor).toBe(Object)
    })

  })

  describe('Deserialization - fromJSON', () => {

    it('should restore all properties from JSON', () => {
      const tab = new Tab({ id: 'placeholder' })

      tab.fromJSON({
        id: 'restored',
        label: 'Restored Label',
        icon: 'restored-icon',
        selected: true
      })

      expect(tab.id).toBe('restored')
      expect(tab.label).toBe('Restored Label')
      expect(tab.icon).toBe('restored-icon')
      expect(tab.selected).toBe(true)
    })

    it('should default label to id when not in JSON', () => {
      const tab = new Tab({ id: 'placeholder' })
      tab.fromJSON({ id: 'no-label' } as TabProps)

      expect(tab.label).toBe('no-label')
    })

    it('should default icon to empty string when not in JSON', () => {
      const tab = new Tab({ id: 'placeholder' })
      tab.fromJSON({ id: 'no-icon' } as TabProps)

      expect(tab.icon).toBe('')
    })

    it('should default selected to false when not in JSON', () => {
      const tab = new Tab({ id: 'placeholder', selected: true })
      tab.fromJSON({ id: 'no-selected' } as TabProps)

      expect(tab.selected).toBe(false)
    })

    it('should return self for chaining', () => {
      const tab = new Tab({ id: 'placeholder' })
      const result = tab.fromJSON({ id: 'chained' })

      expect(result).toBe(tab)
    })

  })

  describe('Serialization Roundtrip', () => {

    it('should preserve all data through toJSON/fromJSON roundtrip', () => {
      const original = new Tab({
        id: 'roundtrip',
        label: 'Roundtrip Label',
        icon: 'roundtrip-icon',
        selected: true
      })

      const json = original.toJSON()
      const restored = new Tab({ id: 'temp' })
      restored.fromJSON(json)

      expect(restored.id).toBe(original.id)
      expect(restored.label).toBe(original.label)
      expect(restored.icon).toBe(original.icon)
      expect(restored.selected).toBe(original.selected)
    })

    it('should produce identical JSON after roundtrip', () => {
      const original = new Tab({
        id: 'json-roundtrip',
        label: 'JSON Label',
        icon: 'json-icon',
        selected: true  // Use non-default value
      })

      const json1 = original.toJSON()
      const restored = new Tab({ id: 'temp' })
      restored.fromJSON(json1)
      const json2 = restored.toJSON()

      expect(json2).toEqual(json1)
    })

    it('should preserve data even when JSON omits defaults', () => {
      // Tab with defaults
      const original = new Tab({ id: 'defaults-test' })
      const json = original.toJSON()

      // JSON is compact
      expect(json).toEqual({ id: 'defaults-test' })

      // But fromJSON restores full state
      const restored = new Tab({ id: 'temp', label: 'defaults-test', icon: 'defaults-icon', selected: true })
      restored.fromJSON(json)

      expect(restored.id).toBe('defaults-test')
      expect(restored.label).toBe('defaults-test')
      expect(restored.icon).toBe('')
      expect(restored.selected).toBe(false)
    })

  })

  describe('Disposal', () => {

    it('should dispose without error', () => {
      const tab = new Tab({ id: 'dispose-test' })
      expect(() => tab.dispose()).not.toThrow()
    })

    it('should be marked as disposed after dispose()', () => {
      const tab = new Tab({ id: 'dispose-check' })
      tab.dispose()
      expect(tab._disposed).toBe(true)
    })

  })

  describe('Edge Cases', () => {

    it('should handle empty id', () => {
      const tab = new Tab({ id: '' })
      expect(tab.id).toBe('')
      expect(tab.label).toBe('')
    })

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(10000)
      const tab = new Tab({ id: longString, label: longString })

      expect(tab.id).toBe(longString)
      expect(tab.label).toBe(longString)
    })

    it('should handle whitespace-only id', () => {
      const tab = new Tab({ id: '   ' })
      expect(tab.id).toBe('   ')
    })

    it('should preserve label when explicitly set to different value than id', () => {
      const tab = new Tab({ id: 'id-value', label: 'different-label' })
      expect(tab.id).toBe('id-value')
      expect(tab.label).toBe('different-label')
    })

  })

})


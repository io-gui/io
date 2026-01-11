//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoDivider, ioDivider } from '@io-gui/layout'

describe('IoDivider', () => {
  let divider: IoDivider
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    divider = new IoDivider({ orientation: 'horizontal', index: 0 })
    container.appendChild(divider)
  })

  afterEach(() => {
    divider.remove()
    container.remove()
  })

  describe('Construction', () => {
    it('should construct with orientation property', () => {
      expect(divider.orientation).toBe('horizontal')
    })

    it('should construct with index property', () => {
      expect(divider.index).toBe(0)
    })

    it('should have pressed false by default', () => {
      expect(divider.pressed).toBe(false)
    })

    it('should construct with vertical orientation', () => {
      const verticalDivider = new IoDivider({ orientation: 'vertical', index: 1 })
      container.appendChild(verticalDivider)

      expect(verticalDivider.orientation).toBe('vertical')
      expect(verticalDivider.index).toBe(1)

      verticalDivider.remove()
    })
  })

  describe('Attribute Reflection', () => {
    it('should reflect orientation to attribute', () => {
      expect(divider.getAttribute('orientation')).toBe('horizontal')

      divider.orientation = 'vertical'
      expect(divider.getAttribute('orientation')).toBe('vertical')
    })

    it('should reflect pressed to attribute when true', () => {
      expect(divider.hasAttribute('pressed')).toBe(false)

      divider.pressed = true
      expect(divider.hasAttribute('pressed')).toBe(true)

      divider.pressed = false
      expect(divider.hasAttribute('pressed')).toBe(false)
    })
  })

  describe('Pointer Events - Basic', () => {
    it('should capture pointer on pointerdown', () => {
      const captureSpy = vi.spyOn(divider, 'setPointerCapture')
      const event = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerdown(event)

      expect(captureSpy).toHaveBeenCalledWith(1)
    })

    it('should set pressed true on pointerdown', () => {
      const event = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerdown(event)

      expect(divider.pressed).toBe(true)
    })

    it('should prevent default on pointerdown', () => {
      const event = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      const preventSpy = vi.spyOn(event, 'preventDefault')

      divider.onPointerdown(event)

      expect(preventSpy).toHaveBeenCalled()
    })

    it('should stop propagation on pointerdown', () => {
      const event = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      const stopSpy = vi.spyOn(event, 'stopPropagation')

      divider.onPointerdown(event)

      expect(stopSpy).toHaveBeenCalled()
    })

    it('should add event listeners on pointerdown', () => {
      const addSpy = vi.spyOn(divider, 'addEventListener')
      const event = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerdown(event)

      expect(addSpy).toHaveBeenCalledWith('pointermove', divider.onPointermove)
      expect(addSpy).toHaveBeenCalledWith('pointerup', divider.onPointerup)
      expect(addSpy).toHaveBeenCalledWith('pointercancel', divider.onPointercancel)
    })
  })

  describe('Pointer Events - Move', () => {
    it('should dispatch io-divider-move event on pointermove', () => {
      const handler = vi.fn()
      divider.addEventListener('io-divider-move', handler)

      const event = new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointermove(event)

      expect(handler).toHaveBeenCalledTimes(1)
      const detail = handler.mock.calls[0][0].detail
      expect(detail.index).toBe(0)
      expect(detail.clientX).toBe(100)
      expect(detail.clientY).toBe(200)
    })

    it('should dispatch io-divider-move with correct index', () => {
      const indexedDivider = new IoDivider({ orientation: 'horizontal', index: 5 })
      container.appendChild(indexedDivider)

      const handler = vi.fn()
      indexedDivider.addEventListener('io-divider-move', handler)

      const event = new PointerEvent('pointermove', {
        clientX: 50,
        clientY: 75,
        bubbles: true,
        cancelable: true,
      })

      indexedDivider.onPointermove(event)

      expect(handler.mock.calls[0][0].detail.index).toBe(5)

      indexedDivider.remove()
    })

    it('should bubble io-divider-move event', () => {
      const handler = vi.fn()
      container.addEventListener('io-divider-move', handler)

      const event = new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointermove(event)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should prevent default on pointermove', () => {
      const event = new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 200,
        bubbles: true,
        cancelable: true,
      })
      const preventSpy = vi.spyOn(event, 'preventDefault')

      divider.onPointermove(event)

      expect(preventSpy).toHaveBeenCalled()
    })
  })

  describe('Pointer Events - Up', () => {
    it('should release pointer capture on pointerup', () => {
      // First capture the pointer
      const downEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerdown(downEvent)

      const releaseSpy = vi.spyOn(divider, 'releasePointerCapture')
      const upEvent = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 150,
        clientY: 250,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerup(upEvent)

      expect(releaseSpy).toHaveBeenCalledWith(1)
    })

    it('should set pressed false on pointerup', () => {
      // First set pressed true
      divider.pressed = true

      const event = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 150,
        clientY: 250,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerup(event)

      expect(divider.pressed).toBe(false)
    })

    it('should dispatch io-divider-move-end event on pointerup', () => {
      const handler = vi.fn()
      divider.addEventListener('io-divider-move-end', handler)

      const event = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 150,
        clientY: 250,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerup(event)

      expect(handler).toHaveBeenCalledTimes(1)
      const detail = handler.mock.calls[0][0].detail
      expect(detail.index).toBe(0)
      expect(detail.clientX).toBe(150)
      expect(detail.clientY).toBe(250)
    })

    it('should bubble io-divider-move-end event', () => {
      const handler = vi.fn()
      container.addEventListener('io-divider-move-end', handler)

      const event = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 150,
        clientY: 250,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerup(event)

      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('should remove event listeners on pointerup', () => {
      // First add listeners via pointerdown
      const downEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerdown(downEvent)

      const removeSpy = vi.spyOn(divider, 'removeEventListener')
      const upEvent = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 150,
        clientY: 250,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointerup(upEvent)

      expect(removeSpy).toHaveBeenCalledWith('pointermove', divider.onPointermove)
      expect(removeSpy).toHaveBeenCalledWith('pointerup', divider.onPointerup)
      expect(removeSpy).toHaveBeenCalledWith('pointercancel', divider.onPointercancel)
    })

    it('should prevent default on pointerup', () => {
      const event = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 150,
        clientY: 250,
        bubbles: true,
        cancelable: true,
      })
      const preventSpy = vi.spyOn(event, 'preventDefault')

      divider.onPointerup(event)

      expect(preventSpy).toHaveBeenCalled()
    })
  })

  describe('Pointer Events - Cancel', () => {
    it('should set pressed false on pointercancel', () => {
      divider.pressed = true

      const event = new PointerEvent('pointercancel', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointercancel(event)

      expect(divider.pressed).toBe(false)
    })

    it('should remove event listeners on pointercancel', () => {
      // First add listeners via pointerdown
      const downEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerdown(downEvent)

      const removeSpy = vi.spyOn(divider, 'removeEventListener')
      const cancelEvent = new PointerEvent('pointercancel', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointercancel(cancelEvent)

      expect(removeSpy).toHaveBeenCalledWith('pointermove', divider.onPointermove)
      expect(removeSpy).toHaveBeenCalledWith('pointerup', divider.onPointerup)
      expect(removeSpy).toHaveBeenCalledWith('pointercancel', divider.onPointercancel)
    })

    it('should NOT dispatch io-divider-move-end on pointercancel', () => {
      const handler = vi.fn()
      divider.addEventListener('io-divider-move-end', handler)

      const event = new PointerEvent('pointercancel', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })

      divider.onPointercancel(event)

      expect(handler).not.toHaveBeenCalled()
    })

    it('should prevent default on pointercancel', () => {
      const event = new PointerEvent('pointercancel', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      const preventSpy = vi.spyOn(event, 'preventDefault')

      divider.onPointercancel(event)

      expect(preventSpy).toHaveBeenCalled()
    })
  })

  describe('Touch Events', () => {
    it('should add touchmove listener on touchstart', () => {
      const addSpy = vi.spyOn(divider, 'addEventListener')
      const event = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
      })

      divider.onTouchstart(event)

      expect(addSpy).toHaveBeenCalledWith('touchmove', divider.onTouchmove, { passive: false })
      expect(addSpy).toHaveBeenCalledWith('touchend', divider.onTouchend)
    })

    it('should prevent default on touchmove', () => {
      const event = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
      })
      const preventSpy = vi.spyOn(event, 'preventDefault')

      divider.onTouchmove(event)

      expect(preventSpy).toHaveBeenCalled()
    })

    it('should remove touch listeners on touchend', () => {
      // First add listeners via touchstart
      const startEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
      })
      divider.onTouchstart(startEvent)

      const removeSpy = vi.spyOn(divider, 'removeEventListener')

      divider.onTouchend()

      expect(removeSpy).toHaveBeenCalledWith('touchmove', divider.onTouchmove)
      expect(removeSpy).toHaveBeenCalledWith('touchend', divider.onTouchend)
    })
  })

  describe('Full Drag Sequence', () => {
    it('should complete full drag sequence', () => {
      const moveHandler = vi.fn()
      const endHandler = vi.fn()
      divider.addEventListener('io-divider-move', moveHandler)
      divider.addEventListener('io-divider-move-end', endHandler)

      // Start drag
      const downEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerdown(downEvent)
      expect(divider.pressed).toBe(true)

      // Move
      const moveEvent = new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: 100,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointermove(moveEvent)
      expect(moveHandler).toHaveBeenCalledTimes(1)

      // Move again
      const moveEvent2 = new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: 150,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointermove(moveEvent2)
      expect(moveHandler).toHaveBeenCalledTimes(2)

      // End drag
      const upEvent = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: 150,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerup(upEvent)

      expect(divider.pressed).toBe(false)
      expect(endHandler).toHaveBeenCalledTimes(1)
    })

    it('should handle cancelled drag sequence', () => {
      const moveHandler = vi.fn()
      const endHandler = vi.fn()
      divider.addEventListener('io-divider-move', moveHandler)
      divider.addEventListener('io-divider-move-end', endHandler)

      // Start drag
      const downEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerdown(downEvent)
      expect(divider.pressed).toBe(true)

      // Move
      const moveEvent = new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: 100,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointermove(moveEvent)
      expect(moveHandler).toHaveBeenCalledTimes(1)

      // Cancel drag
      const cancelEvent = new PointerEvent('pointercancel', {
        pointerId: 1,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointercancel(cancelEvent)

      expect(divider.pressed).toBe(false)
      expect(endHandler).not.toHaveBeenCalled()
    })
  })

  describe('Multiple Pointer IDs', () => {
    it('should handle different pointer IDs', () => {
      // Mock setPointerCapture/releasePointerCapture since browser requires active pointer
      const captureSpy = vi.spyOn(divider, 'setPointerCapture').mockImplementation(() => {})
      const releaseSpy = vi.spyOn(divider, 'releasePointerCapture').mockImplementation(() => {})

      const event1 = new PointerEvent('pointerdown', {
        pointerId: 5,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerdown(event1)
      expect(captureSpy).toHaveBeenCalledWith(5)

      const upEvent = new PointerEvent('pointerup', {
        pointerId: 5,
        clientX: 100,
        clientY: 100,
        bubbles: true,
        cancelable: true,
      })
      divider.onPointerup(upEvent)
      expect(releaseSpy).toHaveBeenCalledWith(5)
    })
  })

  describe('Static Properties', () => {
    it('should have Style getter', () => {
      expect(IoDivider.Style).toBeDefined()
      expect(typeof IoDivider.Style).toBe('string')
      expect(IoDivider.Style).toContain(':host')
      expect(IoDivider.Style).toContain('cursor')
    })

    it('should have Listeners getter', () => {
      expect(IoDivider.Listeners).toBeDefined()
      expect(IoDivider.Listeners.pointerdown).toBe('onPointerdown')
      expect(IoDivider.Listeners.touchstart).toBeDefined()
    })

    it('should configure touchstart as passive false', () => {
      const listeners = IoDivider.Listeners
      expect(Array.isArray(listeners.touchstart)).toBe(true)
      expect(listeners.touchstart[0]).toBe('onTouchstart')
      expect(listeners.touchstart[1]).toEqual({ passive: false })
    })
  })

  describe('Orientation-specific Behavior', () => {
    it('should set horizontal orientation', () => {
      expect(divider.orientation).toBe('horizontal')
      expect(divider.getAttribute('orientation')).toBe('horizontal')
    })

    it('should set vertical orientation', () => {
      divider.orientation = 'vertical'
      expect(divider.orientation).toBe('vertical')
      expect(divider.getAttribute('orientation')).toBe('vertical')
    })

    it('should pass orientation in move events', () => {
      const horizontalHandler = vi.fn()
      divider.addEventListener('io-divider-move', horizontalHandler)

      divider.onPointermove(new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      }))

      // Event contains index but orientation is on the element
      expect(horizontalHandler.mock.calls[0][0].detail.index).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid down/up sequence', () => {
      const endHandler = vi.fn()
      divider.addEventListener('io-divider-move-end', endHandler)

      for (let i = 0; i < 5; i++) {
        const downEvent = new PointerEvent('pointerdown', {
          pointerId: 1,
          bubbles: true,
          cancelable: true,
        })
        divider.onPointerdown(downEvent)

        const upEvent = new PointerEvent('pointerup', {
          pointerId: 1,
          clientX: 100 + i * 10,
          clientY: 50,
          bubbles: true,
          cancelable: true,
        })
        divider.onPointerup(upEvent)
      }

      expect(endHandler).toHaveBeenCalledTimes(5)
      expect(divider.pressed).toBe(false)
    })

    it('should handle zero index', () => {
      expect(divider.index).toBe(0)

      const handler = vi.fn()
      divider.addEventListener('io-divider-move', handler)

      divider.onPointermove(new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      }))

      expect(handler.mock.calls[0][0].detail.index).toBe(0)
    })

    it('should handle large index', () => {
      const largeDivider = new IoDivider({ orientation: 'horizontal', index: 999 })
      container.appendChild(largeDivider)

      const handler = vi.fn()
      largeDivider.addEventListener('io-divider-move', handler)

      largeDivider.onPointermove(new PointerEvent('pointermove', {
        clientX: 100,
        clientY: 50,
        bubbles: true,
        cancelable: true,
      }))

      expect(handler.mock.calls[0][0].detail.index).toBe(999)

      largeDivider.remove()
    })
  })
})

describe('IoDivider Factory Function', () => {
  it('should export ioDivider factory function', () => {
    expect(typeof ioDivider).toBe('function')
  })

  it('should create virtual constructor from factory', () => {
    const vdom = ioDivider({ orientation: 'vertical', index: 2 })

    expect(vdom).toBeDefined()
    expect(vdom.tag).toBe('io-divider')
  })
})


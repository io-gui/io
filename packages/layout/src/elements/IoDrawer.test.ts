//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ioDrawer } from '@io-gui/layout'
import { Panel } from '../nodes/Panel.js'
import { Tab } from '../nodes/Tab.js'

describe('IoDrawer', () => {
  let drawer: IoDrawer
  let container: HTMLElement
  let panel: Panel

  beforeEach(() => {
    container = document.createElement('div')
    container.style.display = 'none'
    document.body.appendChild(container)

    panel = new Panel({
      type: 'panel',
      tabs: [new Tab({ id: 'tab1', label: 'Tab 1' })],
      flex: '0 0 200px'
    })

    drawer = new IoDrawer({
      orientation: 'horizontal',
      direction: 'leading',
      expanded: false,
      child: panel,
      maxSize: 400,
      elements: [],
    })
    container.appendChild(drawer)
  })

  afterEach(() => {
    drawer.remove()
    container.remove()
  })

  describe('Construction', () => {
    it('should construct with orientation property', () => {
      expect(drawer.orientation).toBe('horizontal')
    })

    it('should construct with direction property', () => {
      expect(drawer.direction).toBe('leading')
    })

    it('should construct with expanded false by default', () => {
      expect(drawer.expanded).toBe(false)
    })

    it('should construct with child property', () => {
      expect(drawer.child).toBe(panel)
    })

    it('should construct with maxSize property', () => {
      expect(drawer.maxSize).toBe(400)
    })

    it('should construct with vertical orientation', () => {
      const verticalDrawer = new IoDrawer({
        orientation: 'vertical',
        direction: 'trailing',
        expanded: true,
        child: panel,
        maxSize: 300,
        elements: [],
      })
      container.appendChild(verticalDrawer)

      expect(verticalDrawer.orientation).toBe('vertical')
      expect(verticalDrawer.direction).toBe('trailing')
      expect(verticalDrawer.expanded).toBe(true)
      expect(verticalDrawer.maxSize).toBe(300)

      verticalDrawer.remove()
    })
  })

  // describe('Attribute Reflection', () => {
  //   it('should reflect orientation to attribute', () => {
  //     expect(drawer.getAttribute('orientation')).toBe('horizontal')

  //     drawer.orientation = 'vertical'
  //     expect(drawer.getAttribute('orientation')).toBe('vertical')
  //   })

  //   it('should reflect direction to attribute', () => {
  //     expect(drawer.getAttribute('direction')).toBe('leading')

  //     drawer.direction = 'trailing'
  //     expect(drawer.getAttribute('direction')).toBe('trailing')
  //   })

  //   it('should reflect expanded to attribute when true', () => {
  //     expect(drawer.hasAttribute('expanded')).toBe(false)

  //     drawer.expanded = true
  //     expect(drawer.hasAttribute('expanded')).toBe(true)

  //     drawer.expanded = false
  //     expect(drawer.hasAttribute('expanded')).toBe(false)
  //   })

  //   it('should reflect dragging to attribute when true', () => {
  //     expect(drawer.hasAttribute('dragging')).toBe(false)

  //     drawer.dragging = true
  //     expect(drawer.hasAttribute('dragging')).toBe(true)

  //     drawer.dragging = false
  //     expect(drawer.hasAttribute('dragging')).toBe(false)
  //   })
  // })

  // describe('Drawer Size Calculation', () => {
  //   it('should calculate size from child flexBasis', () => {
  //     const size = drawer.getDrawerSize()
  //     expect(size).toBe(200)
  //   })

  //   it('should clamp size to maxSize', () => {
  //     drawer.maxSize = 150
  //     const size = drawer.getDrawerSize()
  //     expect(size).toBe(150)
  //   })

  //   it('should return 0 when no child', () => {
  //     drawer.child = null
  //     const size = drawer.getDrawerSize()
  //     expect(size).toBe(0)
  //   })

  //   it('should handle auto flex basis', () => {
  //     panel.flex = '1 1 auto'
  //     const size = drawer.getDrawerSize()
  //     expect(size).toBe(240)
  //   })
  // })

  // describe('Click Toggle', () => {
  //   it('should toggle expanded on handle click', () => {
  //     const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

  //     const downEvent = new PointerEvent('pointerdown', {
  //       pointerId: 1,
  //       bubbles: true,
  //       cancelable: true,
  //       target: handle,
  //     })
  //     Object.defineProperty(downEvent, 'target', { value: handle })

  //     drawer.onPointerdown(downEvent)

  //     const upEvent = new PointerEvent('pointerup', {
  //       pointerId: 1,
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //     drawer.onPointerup(upEvent)

  //     expect(drawer.expanded).toBe(true)
  //   })

  //   it('should dispatch io-drawer-expanded-changed on toggle', () => {
  //     const handler = vi.fn()
  //     drawer.addEventListener('io-drawer-expanded-changed', handler)

  //     const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

  //     const downEvent = new PointerEvent('pointerdown', {
  //       pointerId: 1,
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //     Object.defineProperty(downEvent, 'target', { value: handle })

  //     drawer.onPointerdown(downEvent)

  //     const upEvent = new PointerEvent('pointerup', {
  //       pointerId: 1,
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //     drawer.onPointerup(upEvent)

  //     expect(handler).toHaveBeenCalledTimes(1)
  //     const detail = handler.mock.calls[0][0].detail
  //     expect(detail.direction).toBe('leading')
  //     expect(detail.expanded).toBe(true)
  //   })

  //   it('should not toggle when clicking outside handle', () => {
  //     const downEvent = new PointerEvent('pointerdown', {
  //       pointerId: 1,
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //     Object.defineProperty(downEvent, 'target', { value: drawer })

  //     drawer.onPointerdown(downEvent)

  //     expect(drawer.expanded).toBe(false)
  //   })
  // })

  // describe('Drag Expand', () => {
  //   it('should set expanded on drag threshold', () => {
  //     const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

  //     const downEvent = new PointerEvent('pointerdown', {
  //       pointerId: 1,
  //       clientX: 10,
  //       clientY: 50,
  //       bubbles: true,
  //       cancelable: true,
  //     })
  //     Object.defineProperty(downEvent, 'target', { value: handle })

  //     drawer.onPointerdown(downEvent)

  //     const moveEvent = new PointerEvent('pointermove', {
  //       pointerId: 1,
  //       clientX: 100,
  //       clientY: 50,
  //       bubbles: true,
  //       cancelable: true,
  //     })

  //     drawer.onPointermove(moveEvent)

  //     expect(drawer.dragging).toBe(true)
  //     expect(drawer.expanded).toBe(true)
  //   })

//     it('should dispatch expanded event on drag start', () => {
//       const handler = vi.fn()
//       drawer.addEventListener('io-drawer-expanded-changed', handler)

//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         clientX: 10,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       drawer.onPointerdown(downEvent)

//       const moveEvent = new PointerEvent('pointermove', {
//         pointerId: 1,
//         clientX: 100,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })

//       drawer.onPointermove(moveEvent)

//       expect(handler).toHaveBeenCalledTimes(1)
//       expect(handler.mock.calls[0][0].detail.expanded).toBe(true)
//     })

//     it('should not trigger drag without threshold', () => {
//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         clientX: 10,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       drawer.onPointerdown(downEvent)

//       const moveEvent = new PointerEvent('pointermove', {
//         pointerId: 1,
//         clientX: 15,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })

//       drawer.onPointermove(moveEvent)

//       expect(drawer.dragging).toBe(false)
//     })

//     it('should collapse on drag to small size', () => {
//       // Set maxSize small so dragging left results in size below threshold
//       drawer.maxSize = 100
//       drawer.expanded = true

//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         clientX: 100,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       drawer.onPointerdown(downEvent)

//       // Drag left (negative delta) to reduce size below collapse threshold (50px)
//       const moveEvent = new PointerEvent('pointermove', {
//         pointerId: 1,
//         clientX: -80,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })

//       drawer.onPointermove(moveEvent)

//       expect(drawer.dragging).toBe(true)

//       const upEvent = new PointerEvent('pointerup', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })
//       drawer.onPointerup(upEvent)

//       expect(drawer.expanded).toBe(false)
//     })
//   })

//   describe('Pointer Events', () => {
//     it('should capture pointer on pointerdown', () => {
//       const captureSpy = vi.spyOn(drawer, 'setPointerCapture')
//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const event = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(event, 'target', { value: handle })

//       drawer.onPointerdown(event)

//       expect(captureSpy).toHaveBeenCalledWith(1)
//     })

//     it('should release pointer on pointerup', () => {
//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       drawer.onPointerdown(downEvent)

//       const releaseSpy = vi.spyOn(drawer, 'releasePointerCapture')
//       const upEvent = new PointerEvent('pointerup', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })

//       drawer.onPointerup(upEvent)

//       expect(releaseSpy).toHaveBeenCalledWith(1)
//     })

//     it('should add event listeners on pointerdown', () => {
//       const addSpy = vi.spyOn(drawer, 'addEventListener')
//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const event = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(event, 'target', { value: handle })

//       drawer.onPointerdown(event)

//       expect(addSpy).toHaveBeenCalledWith('pointermove', drawer.onPointermove)
//       expect(addSpy).toHaveBeenCalledWith('pointerup', drawer.onPointerup)
//       expect(addSpy).toHaveBeenCalledWith('pointercancel', drawer.onPointercancel)
//     })

//     it('should remove event listeners on pointerup', () => {
//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       drawer.onPointerdown(downEvent)

//       const removeSpy = vi.spyOn(drawer, 'removeEventListener')
//       const upEvent = new PointerEvent('pointerup', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })

//       drawer.onPointerup(upEvent)

//       expect(removeSpy).toHaveBeenCalledWith('pointermove', drawer.onPointermove)
//       expect(removeSpy).toHaveBeenCalledWith('pointerup', drawer.onPointerup)
//       expect(removeSpy).toHaveBeenCalledWith('pointercancel', drawer.onPointercancel)
//     })

//     it('should reset dragging on pointercancel', () => {
//       const handle = drawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         clientX: 10,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       drawer.onPointerdown(downEvent)

//       const moveEvent = new PointerEvent('pointermove', {
//         pointerId: 1,
//         clientX: 100,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })
//       drawer.onPointermove(moveEvent)

//       expect(drawer.dragging).toBe(true)

//       const cancelEvent = new PointerEvent('pointercancel', {
//         pointerId: 1,
//         bubbles: true,
//         cancelable: true,
//       })
//       drawer.onPointercancel(cancelEvent)

//       expect(drawer.dragging).toBe(false)
//     })
//   })

//   describe('Touch Events', () => {
//     it('should add touchmove listener on touchstart', () => {
//       const addSpy = vi.spyOn(drawer, 'addEventListener')
//       const event = new TouchEvent('touchstart', {
//         bubbles: true,
//         cancelable: true,
//       })

//       drawer.onTouchstart(event)

//       expect(addSpy).toHaveBeenCalledWith('touchmove', drawer.onTouchmove, { passive: false })
//       expect(addSpy).toHaveBeenCalledWith('touchend', drawer.onTouchend)
//     })

//     it('should prevent default on touchmove', () => {
//       const event = new TouchEvent('touchmove', {
//         bubbles: true,
//         cancelable: true,
//       })
//       const preventSpy = vi.spyOn(event, 'preventDefault')

//       drawer.onTouchmove(event)

//       expect(preventSpy).toHaveBeenCalled()
//     })

//     it('should remove touch listeners on touchend', () => {
//       const startEvent = new TouchEvent('touchstart', {
//         bubbles: true,
//         cancelable: true,
//       })
//       drawer.onTouchstart(startEvent)

//       const removeSpy = vi.spyOn(drawer, 'removeEventListener')

//       drawer.onTouchend()

//       expect(removeSpy).toHaveBeenCalledWith('touchmove', drawer.onTouchmove)
//       expect(removeSpy).toHaveBeenCalledWith('touchend', drawer.onTouchend)
//     })
//   })

//   describe('Rendering', () => {
//     it('should render handle element', () => {
//       const handle = drawer.querySelector('.io-drawer-handle')
//       expect(handle).not.toBeNull()
//     })

//     it('should render content element', () => {
//       const content = drawer.querySelector('.io-drawer-content')
//       expect(content).not.toBeNull()
//     })

//     it('should render icon in handle', () => {
//       const icon = drawer.querySelector('.io-drawer-handle io-icon')
//       expect(icon).not.toBeNull()
//     })

//     it('should render child panel in content', () => {
//       const panel = drawer.querySelector('.io-drawer-content io-panel')
//       expect(panel).not.toBeNull()
//     })

//     it('should render child split when child is Split', () => {
//       const split = new Split({
//         type: 'split',
//         orientation: 'horizontal',
//         children: [
//           { type: 'panel', tabs: [{ id: 'a', label: 'A' }] },
//           { type: 'panel', tabs: [{ id: 'b', label: 'B' }] },
//         ]
//       })
//       drawer.child = split

//       const splitElement = drawer.querySelector('.io-drawer-content io-split')
//       expect(splitElement).not.toBeNull()
//     })

//     it('should set drawer size CSS variable', () => {
//       const style = drawer.style.getPropertyValue('--io-drawer-size')
//       expect(style).toBe('200px')
//     })
//   })

//   describe('Trailing Direction', () => {
//     let trailingDrawer: IoDrawer

//     beforeEach(() => {
//       trailingDrawer = new IoDrawer({
//         orientation: 'horizontal',
//         direction: 'trailing',
//         expanded: false,
//         child: panel,
//         maxSize: 400,
//         elements: [],
//       })
//       container.appendChild(trailingDrawer)
//     })

//     afterEach(() => {
//       trailingDrawer.remove()
//     })

//     it('should have trailing direction', () => {
//       expect(trailingDrawer.direction).toBe('trailing')
//       expect(trailingDrawer.getAttribute('direction')).toBe('trailing')
//     })

//     it('should invert drag delta for trailing direction', () => {
//       const handle = trailingDrawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         clientX: 100,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       trailingDrawer.onPointerdown(downEvent)

//       const moveEvent = new PointerEvent('pointermove', {
//         pointerId: 1,
//         clientX: 10,
//         clientY: 50,
//         bubbles: true,
//         cancelable: true,
//       })

//       trailingDrawer.onPointermove(moveEvent)

//       expect(trailingDrawer.dragging).toBe(true)
//       expect(trailingDrawer.expanded).toBe(true)
//     })
//   })

//   describe('Vertical Orientation', () => {
//     let verticalDrawer: IoDrawer

//     beforeEach(() => {
//       verticalDrawer = new IoDrawer({
//         orientation: 'vertical',
//         direction: 'leading',
//         expanded: false,
//         child: panel,
//         maxSize: 400,
//         elements: [],
//       })
//       container.appendChild(verticalDrawer)
//     })

//     afterEach(() => {
//       verticalDrawer.remove()
//     })

//     it('should use clientY for vertical drag', () => {
//       const handle = verticalDrawer.querySelector('.io-drawer-handle') as HTMLElement

//       const downEvent = new PointerEvent('pointerdown', {
//         pointerId: 1,
//         clientX: 50,
//         clientY: 10,
//         bubbles: true,
//         cancelable: true,
//       })
//       Object.defineProperty(downEvent, 'target', { value: handle })

//       verticalDrawer.onPointerdown(downEvent)

//       const moveEvent = new PointerEvent('pointermove', {
//         pointerId: 1,
//         clientX: 50,
//         clientY: 100,
//         bubbles: true,
//         cancelable: true,
//       })

//       verticalDrawer.onPointermove(moveEvent)

//       expect(verticalDrawer.dragging).toBe(true)
//       expect(verticalDrawer.expanded).toBe(true)
//     })
//   })

//   describe('Static Properties', () => {
//     it('should have Style getter', () => {
//       expect(IoDrawer.Style).toBeDefined()
//       expect(typeof IoDrawer.Style).toBe('string')
//       expect(IoDrawer.Style).toContain(':host')
//     })

//     it('should have Listeners getter', () => {
//       expect(IoDrawer.Listeners).toBeDefined()
//       expect(IoDrawer.Listeners.pointerdown).toBe('onPointerdown')
//       expect(IoDrawer.Listeners.touchstart).toBeDefined()
//     })
//   })

//   describe('Child Mutation', () => {
//     it('should re-render on child mutation', () => {
//       const renderSpy = vi.spyOn(drawer, 'render')
//       drawer.childMutated()
//       expect(renderSpy).toHaveBeenCalled()
//     })
//   })
// })

// describe('IoDrawer Factory Function', () => {
//   it('should export ioDrawer factory function', () => {
//     expect(typeof ioDrawer).toBe('function')
//   })

//   it('should create virtual constructor from factory', () => {
//     const panel = new Panel({
//       type: 'panel',
//       tabs: [new Tab({ id: 'tab1', label: 'Tab 1' })]
//     })
//     const vdom = ioDrawer({
//       orientation: 'horizontal',
//       direction: 'leading',
//       expanded: false,
//       child: panel,
//       maxSize: 300,
//       elements: [],
//     })

//     expect(vdom).toBeDefined()
//     expect(vdom.tag).toBe('io-drawer')
  // })
})

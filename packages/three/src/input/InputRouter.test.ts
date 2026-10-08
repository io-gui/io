import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Behavior, InputHost, InputRouter, Keymap, ThreeView, ViewInputEvent, navigationKeymaps, parseInput } from '@io-gui/three'
import { Scene } from 'three/webgpu'

type Recorder = Behavior & {log: string[]; wants: (event: ViewInputEvent) => boolean; claimsHover: boolean; handlesKeys: boolean}

function recorder(name: string, priority: number, options: {wants?: (event: ViewInputEvent) => boolean; allowsStealing?: boolean; claimsHover?: boolean; handlesKeys?: boolean} = {}): Recorder {
  const log: string[] = []
  return {
    priority,
    allowsStealing: options.allowsStealing,
    log,
    wants: options.wants ?? (() => true),
    claimsHover: options.claimsHover ?? false,
    handlesKeys: options.handlesKeys ?? false,
    wantsCapture(event) { return this.wants(event) },
    begin(event) { log.push(`${name}:begin:${event.type}:${event.pointerId}`) },
    update(event) { log.push(`${name}:update:${event.type}:${event.pointerId}`) },
    end(event) { log.push(`${name}:end:${event.type}`) },
    cancel() { log.push(`${name}:cancel`) },
    hover() { log.push(`${name}:hover`); return this.claimsHover },
    hoverEnd() { log.push(`${name}:hoverEnd`) },
    key(event) { log.push(`${name}:key:${event.code}`); return this.handlesKeys },
  }
}

function createHost(): InputHost {
  const element = document.createElement('div') as unknown as InputHost
  const view = new ThreeView()
  const scene = new Scene()
  Object.assign(element, {view, scene, getViewCamera: () => view.getCamera(200, 100, scene)})
  element.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:100px'
  element.tabIndex = 0
  document.body.appendChild(element)
  return element
}

function pointer(host: InputHost, type: string, options: {id?: number; button?: number; x?: number; y?: number; shift?: boolean; alt?: boolean} = {}) {
  const event = new PointerEvent(type, {
    bubbles: true, cancelable: true, pointerId: options.id ?? 1, button: options.button ?? 0,
    clientX: options.x ?? 50, clientY: options.y ?? 50, shiftKey: options.shift, altKey: options.alt, pointerType: 'mouse',
  })
  host.dispatchEvent(event)
  return event
}

function wheel(host: InputHost, deltaY = 100) {
  const event = new WheelEvent('wheel', {bubbles: true, cancelable: true, deltaY, clientX: 50, clientY: 50})
  host.dispatchEvent(event)
  return event
}

describe('InputRouter', () => {
  let host: InputHost
  let router: InputRouter

  beforeEach(() => {
    host = createHost()
    router = new InputRouter(host)
  })

  afterEach(() => {
    router.dispose()
    host.view.dispose()
    host.remove()
  })

  it('gives a press to the highest priority behavior that wants it, until release', () => {
    const low = recorder('low', 300)
    const high = recorder('high', 500)
    router.add(low)
    router.add(high)
    expect(router.behaviors).toEqual([high, low])

    pointer(host, 'pointerdown')
    pointer(host, 'pointermove', {x: 60})
    pointer(host, 'pointerup', {x: 60})
    expect(high.log).toEqual(['high:begin:pointerdown:1', 'high:update:pointermove:1', 'high:end:pointerup'])
    expect(low.log).toEqual([])
    expect(router.captured).toBe(null)
  })

  it('skips behaviors that do not want the event', () => {
    const low = recorder('low', 300)
    const high = recorder('high', 500, {wants: event => event.button === 0})
    router.add(low)
    router.add(high)
    pointer(host, 'pointerdown', {button: 1})
    expect(router.captured).toBe(low)
    pointer(host, 'pointerup', {button: 1})
  })

  it('stops only captured events', () => {
    router.add(recorder('picky', 300, {wants: event => event.type !== 'wheel'}))
    expect(wheel(host).defaultPrevented).toBe(false)
    expect(pointer(host, 'pointerdown').defaultPrevented).toBe(true)
    pointer(host, 'pointerup')

    const router2 = new InputRouter(host)
    router.dispose()
    router = router2
    expect(pointer(host, 'pointerdown').defaultPrevented).toBe(false)
  })

  it('runs a one-shot begin and end for wheel events', () => {
    const behavior = recorder('nav', 300)
    router.add(behavior)
    wheel(host)
    expect(behavior.log).toEqual(['nav:begin:wheel:-1', 'nav:end:wheel'])
  })

  it('sends extra pointers to the capturing behavior', () => {
    const behavior = recorder('nav', 300)
    router.add(behavior)
    pointer(host, 'pointerdown', {id: 1})
    pointer(host, 'pointerdown', {id: 2})
    pointer(host, 'pointerup', {id: 1})
    pointer(host, 'pointerup', {id: 2})
    expect(behavior.log).toEqual(['nav:begin:pointerdown:1', 'nav:update:pointerdown:2', 'nav:update:pointerup:1', 'nav:end:pointerup'])
  })

  it('lets another behavior steal a new pointer when the captured one allows it', () => {
    const tool = recorder('tool', 500, {allowsStealing: true, wants: event => event.pointerId === 1})
    const nav = recorder('nav', 300, {wants: event => event.pointerId === 2})
    router.add(tool)
    router.add(nav)
    pointer(host, 'pointerdown', {id: 1})
    pointer(host, 'pointerdown', {id: 2})
    expect(tool.log).toEqual(['tool:begin:pointerdown:1', 'tool:cancel'])
    expect(router.captured).toBe(nav)
    // The thief owns both pointers.
    pointer(host, 'pointermove', {id: 1, x: 70})
    expect(nav.log).toEqual(['nav:begin:pointerdown:2', 'nav:update:pointermove:1'])
  })

  it('cancels the capture on pointercancel and when the behavior is removed', () => {
    const behavior = recorder('nav', 300)
    router.add(behavior)
    pointer(host, 'pointerdown')
    pointer(host, 'pointercancel')
    expect(behavior.log).toEqual(['nav:begin:pointerdown:1', 'nav:cancel'])

    pointer(host, 'pointerdown')
    router.remove(behavior)
    expect(behavior.log.at(-1)).toBe('nav:cancel')
    expect(router.captured).toBe(null)
  })

  it('runs a hover pass when idle, stopping at the first behavior that claims it', () => {
    const gizmo = recorder('gizmo', 800, {claimsHover: true})
    const tool = recorder('tool', 500)
    router.add(gizmo)
    router.add(tool)
    pointer(host, 'pointermove')
    expect(gizmo.log).toEqual(['gizmo:hover'])
    expect(tool.log).toEqual([])

    gizmo.claimsHover = false
    pointer(host, 'pointermove', {x: 60})
    expect(gizmo.log).toEqual(['gizmo:hover', 'gizmo:hover', 'gizmo:hoverEnd'])
    expect(tool.log).toEqual(['tool:hover'])
  })

  it('reports pixel movement per pointer', () => {
    const moves: Array<[number, number]> = []
    router.add({...recorder('nav', 300), update: (event: ViewInputEvent) => { moves.push([event.dx, event.dy]) }})
    pointer(host, 'pointerdown', {x: 10, y: 10})
    pointer(host, 'pointermove', {x: 25, y: 5})
    pointer(host, 'pointermove', {x: 30, y: 5})
    expect(moves).toEqual([[15, -5], [5, 0]])
  })

  it('suppresses the context menu after a captured right press', () => {
    router.add(recorder('nav', 300))
    pointer(host, 'pointerdown', {button: 2})
    pointer(host, 'pointerup', {button: 2})
    const menu = new MouseEvent('contextmenu', {bubbles: true, cancelable: true})
    host.dispatchEvent(menu)
    expect(menu.defaultPrevented).toBe(true)
  })

  it('routes keys to the hovered viewport, ignoring editable targets', () => {
    const behavior = recorder('nav', 300, {handlesKeys: true})
    router.add(behavior)
    host.dispatchEvent(new PointerEvent('pointerenter'))
    const key = new KeyboardEvent('keydown', {code: 'KeyF', bubbles: true, cancelable: true})
    document.body.dispatchEvent(key)
    expect(behavior.log).toEqual(['nav:key:KeyF'])
    expect(key.defaultPrevented).toBe(true)

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyF', bubbles: true}))
    expect(behavior.log.length).toBe(1)
    input.remove()
    host.dispatchEvent(new PointerEvent('pointerleave'))
  })
})

describe('Keymap', () => {
  it('parses inputs', () => {
    expect(parseInput('Alt+LMB drag')).toEqual({trigger: {type: 'press', button: 0}, modifiers: {shift: false, ctrl: false, alt: true, meta: false}})
    expect(parseInput('Ctrl+wheel').trigger).toEqual({type: 'wheel'})
    expect(parseInput('Ctrl+Numpad7')).toEqual({trigger: {type: 'key', code: 'Numpad7'}, modifiers: {shift: false, ctrl: true, alt: false, meta: false}})
  })

  it('matches exact modifiers, first entry wins, and layers by concatenation', () => {
    const host = createHost()
    const router = new InputRouter(host)
    const matches: Array<string | undefined> = []
    const keymap = Keymap.layer(
      new Keymap([{input: 'Shift+LMB drag', action: 'tool.special'}]),
      new Keymap([{input: 'LMB drag', action: 'view.orbit'}, {input: 'Shift+LMB drag', action: 'view.pan'}]),
    )
    router.add({...recorder('probe', 1), wantsCapture: (event: ViewInputEvent) => { matches.push(keymap.match(event)?.action); return false }})
    pointer(host, 'pointerdown')
    pointer(host, 'pointerdown', {shift: true, id: 2})
    pointer(host, 'pointerdown', {alt: true, id: 3})
    expect(matches).toEqual(['view.orbit', 'tool.special', undefined])
    expect(keymap.findConflicts().map(([a, b]) => [a.action, b.action])).toEqual([['tool.special', 'view.pan']])
    router.dispose()
    host.view.dispose()
    host.remove()
  })

  it('ships presets without internal conflicts', () => {
    for (const keymap of Object.values(navigationKeymaps)) {
      expect(keymap.findConflicts()).toEqual([])
    }
  })
})

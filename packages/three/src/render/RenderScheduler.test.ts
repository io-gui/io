import { describe, it, expect, vi } from 'vitest'
import { debounce } from '@io-gui/core'
import { ChangeBus, DirtyReason, DocumentChange, RenderScheduler, ScheduledView, ScheduledTicker, FrameInfo } from '@io-gui/three'
import { Object3D, Scene, WebGPURenderer } from 'three/webgpu'

function fakeRenderer(webgpu = true) {
  return {
    initialized: true,
    backend: {isWebGPUBackend: webgpu},
    init: () => Promise.resolve(),
  } as unknown as WebGPURenderer
}

type FakeView = ScheduledView & {
  draws: Array<ReadonlySet<DirtyReason>>
  renderable: boolean
  priority: number
  converged: boolean
  source: object
  errors: Error[]
}

function fakeView(options: {renderer?: WebGPURenderer; scene?: Scene | null; bus?: ChangeBus | null; source?: object; onDraw?: () => void} = {}): FakeView {
  const view: FakeView = {
    renderer: options.renderer ?? fakeRenderer(),
    scene: options.scene ?? null,
    changeBus: options.bus ?? null,
    source: options.source ?? {},
    draws: [],
    renderable: true,
    priority: 0,
    converged: true,
    errors: [],
    isRenderable: () => view.renderable,
    getPriority: () => view.priority,
    listens: (change: DocumentChange) => change.source === view.source,
    renderView: (reasons: ReadonlySet<DirtyReason>) => {
      view.draws.push(reasons)
      options.onDraw?.()
      return {converged: view.converged}
    },
    onRendererError: (error: Error) => { view.errors.push(error) },
  }
  return view
}

describe('ChangeBus', () => {
  it('queues changes until drained', () => {
    const bus = new ChangeBus()
    const source = {}
    expect(bus.pending).toBe(false)
    bus.notify({kind: 'transform', source})
    bus.notify({kind: 'time', source})
    expect(bus.pending).toBe(true)
    expect(bus.drain().map(change => change.kind)).toEqual(['transform', 'time'])
    expect(bus.pending).toBe(false)
    expect(bus.drain()).toEqual([])
  })
})

describe('RenderScheduler', () => {
  it('draws a newly registered view once, then only when tagged', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const view = fakeView()
    scheduler.register(view)

    scheduler.step()
    expect(view.draws.length).toBe(1)
    expect([...view.draws[0]]).toEqual(['content'])

    scheduler.step()
    expect(view.draws.length).toBe(1)

    scheduler.tag(view, 'view')
    scheduler.tag(view, 'resize')
    scheduler.step()
    expect(view.draws.length).toBe(2)
    expect([...view.draws[1]].sort()).toEqual(['resize', 'view'])
  })

  it('draws only tagged views', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const a = fakeView()
    const b = fakeView()
    scheduler.register(a)
    scheduler.register(b)
    scheduler.step()

    scheduler.tag(a, 'view')
    scheduler.step()
    expect(a.draws.length).toBe(2)
    expect(b.draws.length).toBe(1)
  })

  it('keeps tags of views that are not renderable until they are', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const view = fakeView()
    view.renderable = false
    scheduler.register(view)
    scheduler.step()
    expect(view.draws.length).toBe(0)
    expect(scheduler.getTags(view).has('content')).toBe(true)

    view.renderable = true
    scheduler.step()
    expect(view.draws.length).toBe(1)
  })

  it('tags views that listen to a change on the bus', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const bus = new ChangeBus()
    const sourceA = {}
    const a = fakeView({bus, source: sourceA})
    const b = fakeView({bus, source: {}})
    scheduler.register(a)
    scheduler.register(b)
    scheduler.step()

    bus.notify({kind: 'transform', source: sourceA})
    scheduler.step()
    expect(a.draws.length).toBe(2)
    expect(b.draws.length).toBe(1)
    expect(bus.pending).toBe(false)
  })

  it('ticks tickers before collecting their changes, in the same frame', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const source = {}
    const frames: FrameInfo[] = []
    const ticker: ScheduledTicker = {
      changeBus: new ChangeBus(),
      tick(frame) {
        frames.push(frame)
        this.changeBus.notify({kind: 'time', source})
      },
    }
    const view = fakeView({source})
    scheduler.addTicker(ticker)
    scheduler.register(view)
    scheduler.step()
    scheduler.step()
    expect(frames.map(frame => frame.frame)).toEqual([1, 2])
    expect(view.draws.length).toBe(2)

    scheduler.removeTicker(ticker)
    scheduler.step()
    expect(frames.length).toBe(2)
    expect(view.draws.length).toBe(2)
  })

  it('draws higher priority views first', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const order: string[] = []
    const low = fakeView({onDraw: () => order.push('low')})
    const high = fakeView({onDraw: () => order.push('high')})
    high.priority = 2
    scheduler.register(low)
    scheduler.register(high)
    scheduler.step()
    expect(order).toEqual(['high', 'low'])
  })

  it('stops drawing when the frame budget is used and resumes next frame', () => {
    let clock = 0
    const scheduler = new RenderScheduler({autoStart: false, frameBudget: 10, now: () => clock})
    const views = [0, 1, 2].map(() => fakeView({onDraw: () => { clock += 8 }}))
    views.forEach(view => scheduler.register(view))

    scheduler.step()
    expect(views.map(view => view.draws.length)).toEqual([1, 1, 0])

    scheduler.step()
    expect(views.map(view => view.draws.length)).toEqual([1, 1, 1])
  })

  it('keeps unconverged views tagged continuous', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const view = fakeView()
    view.converged = false
    scheduler.register(view)
    scheduler.step()
    scheduler.step()
    expect(view.draws.length).toBe(2)
    expect([...view.draws[1]]).toEqual(['continuous'])

    view.converged = true
    scheduler.step()
    scheduler.step()
    expect(view.draws.length).toBe(3)
  })

  it('evaluates each scene once per frame and restores matrixWorldAutoUpdate', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const scene = new Scene()
    scene.add(new Object3D())
    const spy = vi.spyOn(scene, 'updateMatrixWorld')
    let autoUpdateDuringDraw: boolean | undefined
    const a = fakeView({scene, onDraw: () => { autoUpdateDuringDraw = scene.matrixWorldAutoUpdate }})
    const b = fakeView({scene})
    scheduler.register(a)
    scheduler.register(b)
    scheduler.step()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(autoUpdateDuringDraw).toBe(false)
    expect(scene.matrixWorldAutoUpdate).toBe(true)
  })

  it('waits for renderer init, then draws', async () => {
    const scheduler = new RenderScheduler({autoStart: false})
    let resolve!: () => void
    const renderer = {
      initialized: false,
      backend: {isWebGPUBackend: true},
      init: () => new Promise<void>(r => { resolve = r }),
    } as unknown as WebGPURenderer
    const view = fakeView({renderer})
    scheduler.register(view)
    scheduler.step()
    expect(view.draws.length).toBe(0)
    expect(scheduler.getRendererState(renderer)).toBe('pending')

    resolve()
    await Promise.resolve()
    await Promise.resolve()
    scheduler.step()
    expect(scheduler.getRendererState(renderer)).toBe('ready')
    expect(view.draws.length).toBe(1)
  })

  it('refuses non-WebGPU backends and reports the error to views', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const scheduler = new RenderScheduler({autoStart: false})
    const renderer = fakeRenderer(false)
    const view = fakeView({renderer})
    scheduler.register(view)
    scheduler.step()
    expect(scheduler.getRendererState(renderer)).toBe('failed')
    expect(view.draws.length).toBe(0)
    expect(view.errors[0].message).toContain('WebGPU')
    errorSpy.mockRestore()
  })

  it('stops ticking and drawing once everything is removed', () => {
    const scheduler = new RenderScheduler({autoStart: false})
    const view = fakeView()
    scheduler.register(view)
    scheduler.unregister(view)
    scheduler.step()
    expect(view.draws.length).toBe(0)
    expect(scheduler.isRegistered(view)).toBe(false)
  })

  it('runs its rAF loop after core FrameScheduler callbacks within a frame', async () => {
    const scheduler = new RenderScheduler()
    const order: string[] = []
    const ticker: ScheduledTicker = {
      changeBus: new ChangeBus(),
      tick: () => { order.push(`tick@${document.timeline.currentTime}`) },
    }
    // Start the loop from inside a core callback, the worst case for ordering.
    await new Promise<void>(resolve => debounce(() => { scheduler.addTicker(ticker); resolve() }))
    for (let i = 0; i < 3; i++) {
      await new Promise<void>(resolve => debounce(() => { order.push(`core@${document.timeline.currentTime}`); resolve() }))
    }
    scheduler.removeTicker(ticker)

    const cores = order.filter(entry => entry.startsWith('core'))
    let sameFrame = 0
    for (const core of cores) {
      const time = core.split('@')[1]
      const tickIndex = order.indexOf(`tick@${time}`)
      if (tickIndex === -1) continue
      sameFrame++
      expect(tickIndex).toBeGreaterThan(order.indexOf(core))
    }
    expect(cores.length).toBe(3)
    expect(sameFrame).toBeGreaterThan(0)
  })
})

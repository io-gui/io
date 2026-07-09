import { describe, it, expect } from 'vitest'
import { ReactiveObject, Register, PropertyDefinitions } from '@io-gui/core'

@Register
class StrNode extends ReactiveObject {
  static override get Properties(): PropertyDefinitions {
    return {v: ''}
  }
  declare v: string
}

/**
 * Multi-hub binding networks.
 *
 * Single-hub spoke batching (onSourceChanged debounce-then-dispatch) is covered
 * in Binding.test.ts. These cases ask whether cascading / nested hubs can still
 * expose inconsistent snapshots to sync handlers mid-wave.
 */
describe('Binding network', () => {
  /**
   * Root fans to HubA + HubB; each hub fans to its own leaf.
   *
   * Root batch-writes both hubs, then dispatches them in sequence. HubA's
   * dispatch pushes LeafA before HubB has pushed LeafB — LeafA's sync handler
   * sees LeafB still holding the old value even though both hubs already hold
   * the new value.
   */
  it('Should not expose stale cascade leaves while an upstream hub wave is in flight', () => {
    const root = new StrNode()
    const hubA = new StrNode()
    const hubB = new StrNode()
    const leafA = new StrNode()
    const leafB = new StrNode()

    hubA.v = root.bind('v') as unknown as string
    hubB.v = root.bind('v') as unknown as string
    leafA.v = hubA.bind('v') as unknown as string
    leafB.v = hubB.bind('v') as unknown as string

    const midWave: {hubA: string, hubB: string, leafA: string, leafB: string}[] = []
    leafA.addEventListener('v-changed', () => {
      midWave.push({
        hubA: hubA.v,
        hubB: hubB.v,
        leafA: leafA.v,
        leafB: leafB.v,
      })
    })

    root.v = 'wave-1'

    expect(hubA.v).toBe('wave-1')
    expect(hubB.v).toBe('wave-1')
    expect(leafA.v).toBe('wave-1')
    expect(leafB.v).toBe('wave-1')
    expect(midWave).toEqual([{
      hubA: 'wave-1',
      hubB: 'wave-1',
      leafA: 'wave-1',
      leafB: 'wave-1',
    }])

    root.dispose()
    hubA.dispose()
    hubB.dispose()
    leafA.dispose()
    leafB.dispose()
  })

  /**
   * Diamond into one sink from two intermediate hubs:
   *   Source → Mid1, Mid2 → Sink.a / Sink.b
   *
   * Sink.aChanged runs when Mid1 pushes; Sink.b may still be old until Mid2
   * dispatches. Derived join state baked in that handler stays wrong.
   */
  it('Should keep diamond sink properties coherent during cascade join', () => {
    @Register
    class Sink extends ReactiveObject {
      static override get Properties(): PropertyDefinitions {
        return {a: '', b: '', joined: ''}
      }
      declare a: string
      declare b: string
      declare joined: string
      aChanged() {
        this.joined = `${this.a}+${this.b}`
      }
      bChanged() {
        this.joined = `${this.a}+${this.b}`
      }
    }

    const source = new StrNode()
    const mid1 = new StrNode()
    const mid2 = new StrNode()
    const sink = new Sink()

    mid1.v = source.bind('v') as unknown as string
    mid2.v = source.bind('v') as unknown as string
    sink.a = mid1.bind('v') as unknown as string
    sink.b = mid2.bind('v') as unknown as string

    const joins: string[] = []
    sink.addEventListener('joined-changed', () => {
      joins.push(sink.joined)
    })

    source.v = 'X'

    expect(sink.a).toBe('X')
    expect(sink.b).toBe('X')
    expect(sink.joined).toBe('X+X')
    // No transient half-join may be observed.
    expect(joins).toEqual(['X+X'])

    source.dispose()
    mid1.dispose()
    mid2.dispose()
    sink.dispose()
  })

  /**
   * Nested hub: Root → Mid + Side; View.side is a spoke of Side (not Root).
   * Mid.vChanged sync-mutates; View re-renders from that mutation and reads
   * View.side. Root batch-writes Mid/Side values, but Side has not yet pushed
   * to View when Mid dispatches — so View.side is still ''.
   */
  it('Should settle nested-hub spokes before an earlier sibling hub dispatches', () => {
    @Register
    class Mid extends ReactiveObject {
      static override get Properties(): PropertyDefinitions {
        return {v: '', payload: ''}
      }
      declare v: string
      declare payload: string
      vChanged() {
        this.payload = this.v ? `loaded:${this.v}` : ''
      }
    }

    @Register
    class View extends ReactiveObject {
      static override get Properties(): PropertyDefinitions {
        return {
          mid: {type: Mid, init: null},
          side: '',
          label: '',
        }
      }
      declare mid: Mid
      declare side: string
      declare label: string
      ready() {
        this.midMutated()
      }
      midMutated() {
        this.label = this.mid.payload ? `${this.side}/${this.mid.payload}` : ''
      }
    }

    const root = new StrNode()
    const mid = new Mid()
    const side = new StrNode()

    mid.v = root.bind('v') as unknown as string
    side.v = root.bind('v') as unknown as string

    const view = new View({mid, side: side.bind('v')})

    root.v = 'asset'

    expect(side.v).toBe('asset')
    expect(mid.v).toBe('asset')
    expect(view.side).toBe('asset')
    expect(view.label).toBe('asset/loaded:asset')

    view.dispose()
    root.dispose()
    mid.dispose()
    side.dispose()
  })

  /**
   * Linear ladder with side leaves. With current Set insertion order, each hub
   * dispatches its child hub before its side leaf, so deeper leaves settle
   * before earlier leaves fire. Documents that chain topology alone does not
   * reproduce the sibling-branch race (contrast the cascade test above).
   */
  it('Should settle deeper ladder leaves before an earlier rung side-leaf fires', () => {
    const root = new StrNode()
    const a = new StrNode()
    const b = new StrNode()
    const c = new StrNode()
    const leafA = new StrNode()
    const leafB = new StrNode()
    const leafC = new StrNode()

    a.v = root.bind('v') as unknown as string
    b.v = a.bind('v') as unknown as string
    c.v = b.bind('v') as unknown as string
    leafA.v = a.bind('v') as unknown as string
    leafB.v = b.bind('v') as unknown as string
    leafC.v = c.bind('v') as unknown as string

    const midWave: {leafB: string, leafC: string, c: string}[] = []
    leafB.addEventListener('v-changed', () => {
      midWave.push({leafB: leafB.v, leafC: leafC.v, c: c.v})
    })

    root.v = 'ladder'

    expect([a.v, b.v, c.v, leafA.v, leafB.v, leafC.v].every(v => v === 'ladder')).toBe(true)
    expect(midWave).toEqual([{leafB: 'ladder', leafC: 'ladder', c: 'ladder'}])

    root.dispose()
    a.dispose()
    b.dispose()
    c.dispose()
    leafA.dispose()
    leafB.dispose()
    leafC.dispose()
  })

  /**
   * Same ladder as above, but side leaves are attached *before* child hubs.
   * Set iteration then dispatches LeafB before C — so LeafB's handler can see
   * LeafC still stale. Shows the race is attachment-order dependent, not
   * topology-free.
   */
  it('Should not leave deeper leaves stale when side leaves are attached before child hubs', () => {
    const root = new StrNode()
    const a = new StrNode()
    const b = new StrNode()
    const c = new StrNode()
    const leafA = new StrNode()
    const leafB = new StrNode()
    const leafC = new StrNode()

    a.v = root.bind('v') as unknown as string
    // Attach leaves before child hubs so Set order hits leaf first on dispatch.
    leafA.v = a.bind('v') as unknown as string
    leafB.v = b.bind('v') as unknown as string
    leafC.v = c.bind('v') as unknown as string
    b.v = a.bind('v') as unknown as string
    c.v = b.bind('v') as unknown as string

    const midWave: {leafB: string, leafC: string, c: string}[] = []
    leafB.addEventListener('v-changed', () => {
      midWave.push({leafB: leafB.v, leafC: leafC.v, c: c.v})
    })

    root.v = 'ladder'

    expect([a.v, b.v, c.v, leafA.v, leafB.v, leafC.v].every(v => v === 'ladder')).toBe(true)
    expect(midWave).toEqual([{leafB: 'ladder', leafC: 'ladder', c: 'ladder'}])

    root.dispose()
    a.dispose()
    b.dispose()
    c.dispose()
    leafA.dispose()
    leafB.dispose()
    leafC.dispose()
  })

  /**
   * Bridge HubL → Bridge → HubR, with leaves on both hubs.
   * Same Set-order luck as the ladder: Bridge is pushed/dispatched before
   * LeafL, so HubR/LeafR settle before LeafL's handler runs.
   */
  it('Should keep cross-hub bridge leaves coherent mid-wave', () => {
    const hubL = new StrNode()
    const hubR = new StrNode()
    const bridge = new StrNode()
    const leafL = new StrNode()
    const leafR = new StrNode()

    bridge.v = hubL.bind('v') as unknown as string
    hubR.v = bridge.bind('v') as unknown as string
    leafL.v = hubL.bind('v') as unknown as string
    leafR.v = hubR.bind('v') as unknown as string

    const midWave: {leafL: string, leafR: string, hubR: string}[] = []
    leafL.addEventListener('v-changed', () => {
      midWave.push({leafL: leafL.v, leafR: leafR.v, hubR: hubR.v})
    })

    hubL.v = 'bridge'

    expect(bridge.v).toBe('bridge')
    expect(hubR.v).toBe('bridge')
    expect(leafL.v).toBe('bridge')
    expect(leafR.v).toBe('bridge')
    expect(midWave).toEqual([{leafL: 'bridge', leafR: 'bridge', hubR: 'bridge'}])

    hubL.dispose()
    hubR.dispose()
    bridge.dispose()
    leafL.dispose()
    leafR.dispose()
  })

  /**
   * Bridge with LeafL attached before Bridge — LeafL dispatches first and can
   * observe HubR/LeafR still empty mid-wave.
   */
  it('Should keep bridge leaves coherent when near leaf is attached before the bridge', () => {
    const hubL = new StrNode()
    const hubR = new StrNode()
    const bridge = new StrNode()
    const leafL = new StrNode()
    const leafR = new StrNode()

    leafL.v = hubL.bind('v') as unknown as string
    bridge.v = hubL.bind('v') as unknown as string
    hubR.v = bridge.bind('v') as unknown as string
    leafR.v = hubR.bind('v') as unknown as string

    const midWave: {leafL: string, leafR: string, hubR: string}[] = []
    leafL.addEventListener('v-changed', () => {
      midWave.push({leafL: leafL.v, leafR: leafR.v, hubR: hubR.v})
    })

    hubL.v = 'bridge'

    expect(bridge.v).toBe('bridge')
    expect(hubR.v).toBe('bridge')
    expect(leafL.v).toBe('bridge')
    expect(leafR.v).toBe('bridge')
    expect(midWave).toEqual([{leafL: 'bridge', leafR: 'bridge', hubR: 'bridge'}])

    hubL.dispose()
    hubR.dispose()
    bridge.dispose()
    leafL.dispose()
    leafR.dispose()
  })
})

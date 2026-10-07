import { describe, it, expect, afterEach } from 'vitest'
import { ThreeApplet } from '@io-gui/three'
import { Scene } from 'three/webgpu'

describe('ThreeApplet', () => {
  let applet: ThreeApplet

  afterEach(() => {
    applet.dispose()
  })

  it('animates and notifies its change bus only while playing', () => {
    applet = new ThreeApplet({ scene: new Scene() })
    const calls: number[] = []
    applet.onAnimate = (delta: number) => { calls.push(delta) }

    applet.tick({frame: 1, delta: 0.016, time: 0.016})
    expect(calls).toEqual([])
    expect(applet.changeBus.pending).toBe(false)

    applet.isPlaying = true
    applet.tick({frame: 2, delta: 0.016, time: 0.032})
    expect(calls).toEqual([0.016])
    expect(applet.changeBus.drain()).toEqual([{kind: 'time', source: applet.document}])
  })

  it('requestRender queues a change for its views', () => {
    applet = new ThreeApplet({ scene: new Scene() })
    applet.requestRender()
    expect(applet.changeBus.drain()).toEqual([{kind: 'other', source: applet.document}])
  })
})

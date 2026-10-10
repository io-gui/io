import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Timeline } from '@io-gui/three'

describe('Timeline', () => {
  let timeline: Timeline

  beforeEach(() => {
    timeline = new Timeline({duration: 1})
  })

  afterEach(() => {
    timeline.dispose()
  })

  it('advances within the duration and wraps to the start when looping', () => {
    expect(timeline.advance(0.75)).toBe(true)
    expect(timeline.currentTime).toBe(0.75)
    expect(timeline.advance(0.5)).toBe(true)
    expect(timeline.currentTime).toBeCloseTo(0.25)
  })

  it('stops at the end when not looping', () => {
    timeline.loop = false
    expect(timeline.advance(0.5)).toBe(true)
    expect(timeline.advance(0.75)).toBe(false)
    expect(timeline.currentTime).toBe(1)
  })

  it('snaps to the nearest frame within the duration', () => {
    timeline.frameRate = 10
    expect(timeline.snapToFrame(0.33)).toBe(0.3)
    expect(timeline.snapToFrame(0.36)).toBe(0.4)
    expect(timeline.snapToFrame(-0.2)).toBe(0)
    expect(timeline.snapToFrame(1.5)).toBe(1)
  })

  it('steps whole frames from the nearest frame, within the duration', () => {
    timeline.frameRate = 10
    timeline.currentTime = 0.33
    timeline.stepFrames(1)
    expect(timeline.currentTime).toBe(0.4)
    timeline.stepFrames(-10)
    expect(timeline.currentTime).toBe(0)
    timeline.currentTime = 0.95
    timeline.stepFrames(2)
    expect(timeline.currentTime).toBe(1)
  })

  it('keeps the current time within a shorter duration', () => {
    timeline.duration = 10
    timeline.currentTime = 8
    timeline.duration = 5
    expect(timeline.currentTime).toBe(5)
  })

  it('mirrors the current time in its TSL uniform', () => {
    timeline.currentTime = 0.5
    expect(timeline.timeNode.value).toBe(0.5)
    timeline.currentTime = 0.25
    expect(timeline.timeNode.value).toBe(0.25)
    const started = new Timeline({currentTime: 2, duration: 3})
    expect(started.timeNode.value).toBe(2)
    started.dispose()
  })
})

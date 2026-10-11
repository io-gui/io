import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextFrame } from '@io-gui/core'
import { ThreeTimelineRange, Timeline, getDividerSteps, pickDividerStep, formatTimeLabel } from '@io-gui/three'

describe('Timeline dividers', () => {
  it('divide a second into whole frames, then grow in clock steps', () => {
    expect(getDividerSteps(30).slice(0, 13)).toEqual([1 / 30, 2 / 30, 3 / 30, 5 / 30, 6 / 30, 10 / 30, 15 / 30, 1, 2, 5, 10, 15, 30])
    expect(getDividerSteps(24).slice(0, 8)).toEqual([1 / 24, 2 / 24, 3 / 24, 4 / 24, 6 / 24, 8 / 24, 12 / 24, 1])
    expect(getDividerSteps(30).slice(13, 19)).toEqual([60, 120, 300, 600, 900, 1800])
    expect(getDividerSteps(29.97)).toBe(getDividerSteps(30))
  })

  it('pick the smallest step past the minimum that lands on the finer level', () => {
    const steps = getDividerSteps(30)
    expect(pickDividerStep(steps, 0)).toBe(1 / 30)
    expect(pickDividerStep(steps, 0.15)).toBe(5 / 30)
    expect(pickDividerStep(steps, 0.15, 3 / 30)).toBe(6 / 30)
    expect(pickDividerStep(steps, 3, 2)).toBe(10)
  })

  it('label seconds with the decimals the step needs, or seconds and frames', () => {
    expect(formatTimeLabel(2, 1, 30)).toBe('2')
    expect(formatTimeLabel(1.5, 0.5, 30)).toBe('1.5')
    expect(formatTimeLabel(2.25, 0.25, 24)).toBe('2.25')
    expect(formatTimeLabel(2 + 5 / 30, 5 / 30, 30)).toBe('2+05')
    expect(formatTimeLabel(2 + 1 / 12, 1 / 12, 24)).toBe('2+02')
    expect(formatTimeLabel(90, 10, 30)).toBe('1:30')
    expect(formatTimeLabel(61.5, 0.5, 30)).toBe('1:01.5')
    expect(formatTimeLabel(3600 + 65, 5, 30)).toBe('1:01:05')
  })
})

describe('ThreeTimelineRange', () => {
  let timeline: Timeline
  let range: ThreeTimelineRange

  /** Viewport x of a fraction of the range's width. */
  const clientX = (fraction: number) => range.getBoundingClientRect().left + range.clientLeft + fraction * range.size[0]
  const pointer = (type: string, fraction: number) => {
    range.dispatchEvent(new PointerEvent(type, {bubbles: true, cancelable: true, pointerId: 1, button: 0, clientX: clientX(fraction)}))
  }
  const key = (key: string, shiftKey = false) => {
    range.dispatchEvent(new KeyboardEvent('keydown', {key, shiftKey, bubbles: true, cancelable: true}))
  }

  beforeEach(() => {
    timeline = new Timeline({duration: 4, frameRate: 10})
    range = new ThreeTimelineRange({timeline})
    range.style.cssText = 'position: fixed; left: 0; bottom: 0; width: 400px;'
    // Synthetic pointers have no active pointer to capture.
    range.setPointerCapture = () => {}
    range.releasePointerCapture = () => {}
    document.body.appendChild(range)
    range.onResized()
  })

  afterEach(() => {
    range.remove()
    range.dispose()
    timeline.dispose()
  })

  it('shows the whole timeline, again when the duration changes', () => {
    expect([range.viewStart, range.viewEnd]).toEqual([0, 4])
    timeline.duration = 8
    expect([range.viewStart, range.viewEnd]).toEqual([0, 8])
  })

  it('shows a timeline it is given', () => {
    const other = new Timeline({duration: 2})
    range.timeline = other
    expect([range.viewStart, range.viewEnd]).toEqual([0, 2])
    other.dispose()
  })

  it('keeps the view between a few frames and a few durations, within the timeline', () => {
    range.setView(-5, 100)
    expect([range.viewStart, range.viewEnd]).toEqual([0, 16])
    range.setView(3, 1)
    expect([range.viewStart, range.viewEnd]).toEqual([3, 4])
    range.setView(0, 0.01)
    expect([range.viewStart, range.viewEnd]).toEqual([0, 0.4])
  })

  it('zooms around the time under the pointer', () => {
    range.dispatchEvent(new WheelEvent('wheel', {deltaY: -100, clientX: clientX(0.5), cancelable: true}))
    expect(range.viewEnd - range.viewStart).toBeCloseTo(4 * Math.exp(-0.2))
    expect((range.viewStart + range.viewEnd) / 2).toBeCloseTo(2)
  })

  it('scrubs to the frame under the pointer, reporting the drag', async () => {
    pointer('pointerdown', 0.26)
    expect(range.scrubbing).toBe(true)
    expect(timeline.currentTime).toBe(1)
    pointer('pointermove', 0.5)
    await nextFrame()
    expect(timeline.currentTime).toBe(2)
    pointer('pointerup', 0.5)
    expect(range.scrubbing).toBe(false)
  })

  it('steps frames with arrow keys and jumps with Home and End', () => {
    key('ArrowRight')
    expect(timeline.currentTime).toBe(0.1)
    key('ArrowRight', true)
    expect(timeline.currentTime).toBe(1.1)
    key('ArrowLeft')
    expect(timeline.currentTime).toBe(1)
    key('End')
    expect(timeline.currentTime).toBe(4)
    key('Home')
    expect(timeline.currentTime).toBe(0)
  })

  it('draws the playhead at the current time', () => {
    timeline.currentTime = 2
    range.onRender()
    const canvas = range.querySelector('canvas')!
    const x = Math.round(canvas.width / 2)
    const [r, g, b] = canvas.getContext('2d')!.getImageData(x, canvas.height - 1, 1, 1).data
    const blue = range.theme.bgColorBlue
    expect(Math.abs(r - blue.r * 255)).toBeLessThan(3)
    expect(Math.abs(g - blue.g * 255)).toBeLessThan(3)
    expect(Math.abs(b - blue.b * 255)).toBeLessThan(3)
  })
})

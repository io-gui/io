import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { IoButton } from '@io-gui/inputs'
import { IconsetSingleton } from '@io-gui/icons'
import { ThreeTimeline, ThreeTimelineRange, Document, Editor, Timeline } from '@io-gui/three'

describe('three iconset', () => {
  it('registers the transport icons in the three namespace, mapped from the Material Symbols viewBox', () => {
    for (const id of ['skip_start', 'frame_back', 'play', 'pause', 'frame_forward', 'skip_end', 'loop']) {
      const svg = IconsetSingleton.getIcon(`three:${id}`)
      expect(svg).toContain(`class="icon-id-${id}"`)
      expect(svg).toContain('transform="scale(0.025) translate(0 960)"')
      expect(svg).toContain('<path d="M')
    }
  })
})

describe('ThreeTimeline', () => {
  let content: Document
  let editor: Editor
  let element: ThreeTimeline

  const button = (icon: string) => [...element.querySelectorAll('io-button')].find(button => (button as IoButton).icon === icon) as IoButton
  const range = () => element.querySelector('three-timeline-range') as ThreeTimelineRange

  beforeEach(() => {
    content = new Document({timeline: new Timeline({duration: 2, frameRate: 10})})
    editor = new Editor({document: content})
    element = new ThreeTimeline({editor})
    element.style.display = 'none'
    document.body.appendChild(element)
  })

  afterEach(() => {
    element.remove()
    element.dispose()
    editor.dispose()
    content.dispose()
  })

  it('shows the document timeline in its range', () => {
    expect(range().timeline).toBe(content.timeline)
  })

  it('plays and pauses the editor, showing the action on its button', () => {
    button('three:play').click()
    expect(editor.isPlaying).toBe(true)
    button('three:pause').click()
    expect(editor.isPlaying).toBe(false)
    expect(button('three:play')).toBeInstanceOf(IoButton)
  })

  it('steps frames, jumps to either end and toggles looping', () => {
    const timeline = content.timeline
    button('three:frame_forward').click()
    expect(timeline.currentTime).toBe(0.1)
    button('three:skip_end').click()
    expect(timeline.currentTime).toBe(2)
    button('three:frame_back').click()
    expect(timeline.currentTime).toBe(1.9)
    button('three:skip_start').click()
    expect(timeline.currentTime).toBe(0)
    button('three:loop').click()
    expect(timeline.loop).toBe(false)
    expect(button('three:loop').selected).toBe(false)
  })

  it('pauses playback while scrubbing and resumes it after', () => {
    editor.isPlaying = true
    range().scrubbing = true
    expect(editor.isPlaying).toBe(false)
    range().scrubbing = false
    expect(editor.isPlaying).toBe(true)
    editor.isPlaying = false
    range().scrubbing = true
    range().scrubbing = false
    expect(editor.isPlaying).toBe(false)
  })

  it('toggles playback with Space on its range', () => {
    range().dispatchEvent(new KeyboardEvent('keydown', {code: 'Space', key: ' ', bubbles: true}))
    expect(editor.isPlaying).toBe(true)
    editor.isPlaying = false
  })

  it('follows the editor to another document', () => {
    const other = new Document({timeline: new Timeline({loop: false})})
    editor.document = other
    expect(range().timeline).toBe(other.timeline)
    expect(button('three:loop').selected).toBe(false)
    other.dispose()
  })
})

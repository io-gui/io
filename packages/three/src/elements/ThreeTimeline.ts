import { Register, Property, ReactiveElement, ReactiveElementProps, Field, Change } from '@io-gui/core'
import { ioButton, ioNumber } from '@io-gui/inputs'
import { Editor } from '../editor/Editor.js'
import { threeTimelineRange } from './ThreeTimelineRange.js'
import '../icons/threeIcons.js'

export type ThreeTimelineProps = ReactiveElementProps & {
  editor: Editor
}

/**
 * Controls for the timeline of the editor's document: transport buttons (start, frame back, play / pause, frame
 * forward, end, loop), its scrubbable range, and the current time and duration in seconds. Scrubbing pauses playback
 * until released.
 */
@Register
export class ThreeTimeline extends ReactiveElement {

  static override get Style() {
    return /* css */`
      :host {
        display: flex;
        align-items: center;
        gap: var(--io_spacing);
        padding: var(--io_spacing);
      }
      :host > io-button > io-icon {
        margin-right: 0;
      }
      :host > io-number {
        min-width: 4em;
        text-align: right;
      }
    `
  }

  @Property({type: Editor})
  declare editor: Editor

  /** Whether the editor played when scrubbing started; it plays again on release. */
  @Field(false)
  declare private _resumeAfterScrub: boolean

  constructor(args: ThreeTimelineProps) { super(args) }

  override ready() {
    this.changed()
  }

  editorChanged() {
    this.changed()
  }

  editorMutated() {
    this.changed()
  }

  onSkipStart() {
    this.editor.document.timeline.currentTime = 0
  }

  onFrameBack() {
    this.editor.document.timeline.stepFrames(-1)
  }

  onTogglePlaying() {
    this.editor.isPlaying = !this.editor.isPlaying
  }

  onFrameForward() {
    this.editor.document.timeline.stepFrames(1)
  }

  onSkipEnd() {
    const timeline = this.editor.document.timeline
    timeline.currentTime = timeline.duration
  }

  onToggleLoop() {
    const timeline = this.editor.document.timeline
    timeline.loop = !timeline.loop
  }

  onScrubbingChanged(event: CustomEvent<Change<boolean>>) {
    if (event.detail.value) {
      this._resumeAfterScrub = this.editor.isPlaying
      this.editor.isPlaying = false
    } else if (this._resumeAfterScrub) {
      this.editor.isPlaying = true
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.onTogglePlaying()
    }
  }

  changed() {
    const timeline = this.editor.document.timeline
    const playing = this.editor.isPlaying
    this.render([
      ioButton({icon: 'three:skip_start', title: 'Jump to start', action: this.onSkipStart}),
      ioButton({icon: 'three:frame_back', title: 'Previous frame', action: this.onFrameBack}),
      ioButton({icon: playing ? 'three:pause' : 'three:play', title: playing ? 'Pause' : 'Play', action: this.onTogglePlaying}),
      ioButton({icon: 'three:frame_forward', title: 'Next frame', action: this.onFrameForward}),
      ioButton({icon: 'three:skip_end', title: 'Jump to end', action: this.onSkipEnd}),
      ioButton({icon: 'three:loop', title: 'Loop', selected: timeline.bind('loop'), action: this.onToggleLoop}),
      threeTimelineRange({
        timeline,
        '@scrubbing-changed': this.onScrubbingChanged,
        '@keydown': this.onKeyDown,
      }),
      ioNumber({value: timeline.bind('currentTime'), min: 0, step: 0.01, title: 'Current time (s)'}),
      ioNumber({value: timeline.bind('duration'), min: 0, step: 0.01, title: 'Duration (s)'}),
    ])
  }
}

export const threeTimeline = function(arg0: ThreeTimelineProps) {
  return ThreeTimeline.vConstructor(arg0)
}

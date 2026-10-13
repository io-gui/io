import { Register, ReactiveObject, ReactiveObjectProps, Property } from '@io-gui/core'
import { UniformNode } from 'three/webgpu'
import { renderGroup, uniform } from 'three/tsl'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumber } from '@io-gui/inputs'
import { ioOptionSelect, Menu } from '@io-gui/menus'

export type TimelineProps = ReactiveObjectProps & {
  currentTime?: number
  duration?: number
  frameRate?: number
  loop?: boolean
  autoplay?: boolean
}

/**
 * A document's clock: the current time within `[0, duration]` seconds, the frame rate of stepping and scrubbing,
 * and how playback loops and starts. Playback advances it; the document animates on every change of `currentTime`.
 */
@Register
export class Timeline extends ReactiveObject {

  /** Seconds from the start: the playhead. */
  @Property({type: Number, value: 0})
  declare currentTime: number

  /** Length in seconds. Playback wraps or stops here. */
  @Property({type: Number, value: 10})
  declare duration: number

  /** Frames per second: the unit of frame stepping and scrubbing. */
  @Property({type: Number, value: 30})
  declare frameRate: number

  /** Whether playback wraps from the end to the start instead of stopping. */
  @Property({type: Boolean, value: true})
  declare loop: boolean

  /**
   * Whether the document plays (`editor.isPlaying`) when opened. The editor does not read it; whatever opens
   * the document sets `isPlaying` from it.
   */
  @Property({type: Boolean, value: false})
  declare autoplay: boolean

  /** Created on first use. Declared: `currentTimeChanged` can run inside the base constructor. */
  declare private _timeNode: UniformNode<'float', number> | undefined

  constructor(args?: TimelineProps) {
    super(args)
  }

  /**
   * `currentTime` as a TSL uniform. Shader animation built on it follows the timeline; TSL's global `time` keeps
   * running while paused and ignores scrubbing. Shared per render like `time`: a per-object uniform reaches the GPU
   * only when its object refreshes in full, which an unchanged object without node properties does not (it stays at
   * its first value in scene nodes such as `environmentNode` or `fogNode`).
   */
  get timeNode(): UniformNode<'float', number> {
    if (!this._timeNode) this._timeNode = uniform(this.currentTime).setGroup(renderGroup)
    return this._timeNode
  }

  currentTimeChanged() {
    this.timeNode.value = this.currentTime
  }

  durationChanged() {
    if (this.currentTime > this.duration) this.currentTime = this.duration
  }

  /**
   * Moves `currentTime` forward by `delta` seconds of playback. Past `duration` it wraps to the start when `loop`
   * is set; otherwise it stops at the end and returns `false`.
   */
  advance(delta: number): boolean {
    const time = this.currentTime + delta
    if (time < this.duration) {
      this.currentTime = time
    } else if (this.loop) {
      this.currentTime = this.duration > 0 ? time % this.duration : 0
    } else {
      this.currentTime = this.duration
      return false
    }
    return true
  }

  /** The time of the frame nearest to `time`, within `[0, duration]`. */
  snapToFrame(time: number): number {
    const snapped = Math.round(time * this.frameRate) / this.frameRate
    return Math.min(Math.max(snapped, 0), this.duration)
  }

  /** Moves `currentTime` by whole frames from the nearest frame, within `[0, duration]`. */
  stepFrames(count: number) {
    this.currentTime = this.snapToFrame(this.currentTime + count / this.frameRate)
  }
}

registerEditorConfig(Timeline, [
  ['currentTime', ioNumber({min: 0, step: 0.001})],
  ['duration', ioNumber({min: 0, step: 0.01})],
  ['frameRate', ioOptionSelect({model: new Menu({options: [
    {value: 24, id: '24 fps'},
    {value: 25, id: '25 fps'},
    {value: 30, id: '30 fps'},
    {value: 50, id: '50 fps'},
    {value: 60, id: '60 fps'},
  ]})})],
])

registerEditorGroups(Timeline, {
  Main: ['currentTime', 'duration', 'frameRate', 'loop', 'autoplay'],
  Hidden: ['timeNode', '_timeNode'],
})

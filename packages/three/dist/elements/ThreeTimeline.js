var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, ReactiveElement, Field } from '@io-gui/core';
import { ioButton, ioNumber } from '@io-gui/inputs';
import { Editor } from '../editor/Editor.js';
import { threeTimelineRange } from './ThreeTimelineRange.js';
import '../icons/threeIcons.js';
/**
 * Controls for the timeline of the editor's document: transport buttons (start, frame back, play / pause, frame
 * forward, end, loop), its scrubbable range, and the current time and duration in seconds. Scrubbing pauses playback
 * until released.
 */
let ThreeTimeline = class ThreeTimeline extends ReactiveElement {
    static get Style() {
        return /* css */ `
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
    `;
    }
    constructor(args) { super(args); }
    ready() {
        this.changed();
    }
    editorChanged() {
        this.changed();
    }
    editorMutated() {
        this.changed();
    }
    onSkipStart() {
        this.editor.document.timeline.currentTime = 0;
    }
    onFrameBack() {
        this.editor.document.timeline.stepFrames(-1);
    }
    onTogglePlaying() {
        this.editor.isPlaying = !this.editor.isPlaying;
    }
    onFrameForward() {
        this.editor.document.timeline.stepFrames(1);
    }
    onSkipEnd() {
        const timeline = this.editor.document.timeline;
        timeline.currentTime = timeline.duration;
    }
    onToggleLoop() {
        const timeline = this.editor.document.timeline;
        timeline.loop = !timeline.loop;
    }
    onScrubbingChanged(event) {
        if (event.detail.value) {
            this._resumeAfterScrub = this.editor.isPlaying;
            this.editor.isPlaying = false;
        }
        else if (this._resumeAfterScrub) {
            this.editor.isPlaying = true;
        }
    }
    onKeyDown(event) {
        if (event.code === 'Space') {
            this.onTogglePlaying();
        }
    }
    changed() {
        const timeline = this.editor.document.timeline;
        const playing = this.editor.isPlaying;
        this.render([
            ioButton({ icon: 'three:skip_start', title: 'Jump to start', action: this.onSkipStart }),
            ioButton({ icon: 'three:frame_back', title: 'Previous frame', action: this.onFrameBack }),
            ioButton({ icon: playing ? 'three:pause' : 'three:play', title: playing ? 'Pause' : 'Play', action: this.onTogglePlaying }),
            ioButton({ icon: 'three:frame_forward', title: 'Next frame', action: this.onFrameForward }),
            ioButton({ icon: 'three:skip_end', title: 'Jump to end', action: this.onSkipEnd }),
            ioButton({ icon: 'three:loop', title: 'Loop', selected: timeline.bind('loop'), action: this.onToggleLoop }),
            threeTimelineRange({
                timeline,
                '@scrubbing-changed': this.onScrubbingChanged,
                '@keydown': this.onKeyDown,
            }),
            ioNumber({ value: timeline.bind('currentTime'), min: 0, step: 0.01, title: 'Current time (s)' }),
            ioNumber({ value: timeline.bind('duration'), min: 0, step: 0.01, title: 'Duration (s)' }),
        ]);
    }
};
__decorate([
    Property({ type: Editor })
], ThreeTimeline.prototype, "editor", void 0);
__decorate([
    Field(false)
], ThreeTimeline.prototype, "_resumeAfterScrub", void 0);
ThreeTimeline = __decorate([
    Register
], ThreeTimeline);
export { ThreeTimeline };
export const threeTimeline = function (arg0) {
    return ThreeTimeline.vConstructor(arg0);
};

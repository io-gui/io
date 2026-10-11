var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, ReactiveObject, Property } from '@io-gui/core';
import { uniform } from 'three/tsl';
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors';
import { ioNumber } from '@io-gui/inputs';
import { ioOptionSelect, Menu } from '@io-gui/menus';
/**
 * A document's clock: the current time within `[0, duration]` seconds, the frame rate of stepping and scrubbing,
 * and how playback loops and starts. Playback advances it; the document animates on every change of `currentTime`.
 */
let Timeline = class Timeline extends ReactiveObject {
    constructor(args) {
        super(args);
    }
    /**
     * `currentTime` as a TSL uniform. Shader animation built on it follows the timeline; TSL's global `time` keeps
     * running while paused and ignores scrubbing.
     */
    get timeNode() {
        if (!this._timeNode)
            this._timeNode = uniform(this.currentTime);
        return this._timeNode;
    }
    currentTimeChanged() {
        this.timeNode.value = this.currentTime;
    }
    durationChanged() {
        if (this.currentTime > this.duration)
            this.currentTime = this.duration;
    }
    /**
     * Moves `currentTime` forward by `delta` seconds of playback. Past `duration` it wraps to the start when `loop`
     * is set; otherwise it stops at the end and returns `false`.
     */
    advance(delta) {
        const time = this.currentTime + delta;
        if (time < this.duration) {
            this.currentTime = time;
        }
        else if (this.loop) {
            this.currentTime = this.duration > 0 ? time % this.duration : 0;
        }
        else {
            this.currentTime = this.duration;
            return false;
        }
        return true;
    }
    /** The time of the frame nearest to `time`, within `[0, duration]`. */
    snapToFrame(time) {
        const snapped = Math.round(time * this.frameRate) / this.frameRate;
        return Math.min(Math.max(snapped, 0), this.duration);
    }
    /** Moves `currentTime` by whole frames from the nearest frame, within `[0, duration]`. */
    stepFrames(count) {
        this.currentTime = this.snapToFrame(this.currentTime + count / this.frameRate);
    }
};
__decorate([
    Property({ type: Number, value: 0 })
], Timeline.prototype, "currentTime", void 0);
__decorate([
    Property({ type: Number, value: 10 })
], Timeline.prototype, "duration", void 0);
__decorate([
    Property({ type: Number, value: 30 })
], Timeline.prototype, "frameRate", void 0);
__decorate([
    Property({ type: Boolean, value: true })
], Timeline.prototype, "loop", void 0);
__decorate([
    Property({ type: Boolean, value: false })
], Timeline.prototype, "autoplay", void 0);
Timeline = __decorate([
    Register
], Timeline);
export { Timeline };
registerEditorConfig(Timeline, [
    ['currentTime', ioNumber({ min: 0, step: 0.001 })],
    ['duration', ioNumber({ min: 0, step: 0.01 })],
    ['frameRate', ioOptionSelect({ model: new Menu({ options: [
                    { value: 24, id: '24 fps' },
                    { value: 25, id: '25 fps' },
                    { value: 30, id: '30 fps' },
                    { value: 50, id: '50 fps' },
                    { value: 60, id: '60 fps' },
                ] }) })],
]);
registerEditorGroups(Timeline, {
    Main: ['currentTime', 'duration', 'frameRate', 'loop', 'autoplay'],
    Hidden: ['timeNode', '_timeNode'],
});

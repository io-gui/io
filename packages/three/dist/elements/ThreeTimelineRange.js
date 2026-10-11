var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, Property, IoGl, Field } from '@io-gui/core';
import { Timeline } from '../editor/Timeline.js';
/** Least on-screen spacing of each divider level, in CSS pixels. Major dividers are labeled. */
const MINOR_SPACING = 6;
const MEDIUM_SPACING = 24;
const MAJOR_SPACING = 72;
/** The view spans at least this many frames, and at most this many timeline durations. */
const MIN_VIEW_FRAMES = 4;
const MAX_VIEW_DURATIONS = 4;
/** Clock steps of a second or more: seconds, then minutes, then hours. */
const CLOCK_STEPS = [1, 60, 3600].flatMap(unit => [1, 2, 5, 10, 15, 30].map(count => count * unit));
const dividerStepsCache = new Map();
/**
 * Divider steps in seconds, ascending: frame counts that divide one second (so every divider falls on a frame and
 * on whole seconds), then 1, 2, 5, 10, 15 and 30 seconds, minutes and hours.
 */
export function getDividerSteps(frameRate) {
    const frames = Math.max(1, Math.round(frameRate));
    let steps = dividerStepsCache.get(frames);
    if (!steps) {
        steps = [];
        for (let count = 1; count < frames; count++) {
            if (frames % count === 0)
                steps.push(count / frames);
        }
        steps.push(...CLOCK_STEPS);
        dividerStepsCache.set(frames, steps);
    }
    return steps;
}
const isWholeMultiple = (step, unit) => {
    const ratio = step / unit;
    return Math.abs(ratio - Math.round(ratio)) < 1e-6;
};
/** The smallest of `steps` that is at least `minimum` and a whole multiple of `unit`, so coarser dividers land on finer ones. */
export function pickDividerStep(steps, minimum, unit = 0) {
    for (const step of steps) {
        if (step >= minimum && (!unit || isWholeMultiple(step, unit)))
            return step;
    }
    return steps[steps.length - 1];
}
/** Seconds with `decimals`, as `m:ss` from a minute and `h:mm:ss` from an hour. */
const formatClock = (time, decimals) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = (time - hours * 3600 - minutes * 60).toFixed(decimals);
    if (!hours && !minutes)
        return seconds;
    const paddedSeconds = seconds.padStart(decimals ? decimals + 3 : 2, '0');
    return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}` : `${minutes}:${paddedSeconds}`;
};
/**
 * Formats a divider label for dividers `step` seconds apart: seconds with up to two decimals, or seconds and frames
 * (`2+05`) for frame steps that are no round decimal.
 */
export function formatTimeLabel(time, step, frameRate) {
    let decimals = 0;
    while (decimals < 3 && !isWholeMultiple(step * 10 ** decimals, 1))
        decimals++;
    if (decimals < 3)
        return formatClock(time, decimals);
    const framesPerSecond = Math.max(1, Math.round(frameRate));
    const frames = Math.round(time * framesPerSecond);
    const seconds = Math.floor(frames / framesPerSecond);
    const frame = String(frames - seconds * framesPerSecond).padStart(String(framesPerSecond - 1).length, '0');
    return `${formatClock(seconds, 0)}+${frame}`;
}
/**
 * Scrubbable range of a `Timeline`, drawn by one shader: dividers at frame-aligned steps that adapt to any zoom,
 * labels on the major ones, and the playhead at `currentTime`. Drag scrubs (snapped to frames), the wheel zooms
 * around the pointer, horizontal wheel or Shift+wheel pans. Arrow keys step frames (Shift: ten), Home and End jump.
 */
let ThreeTimelineRange = class ThreeTimelineRange extends IoGl {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        cursor: ew-resize;
        touch-action: none;
        border: var(--io_border);
        border-radius: var(--io_borderRadius);
        border-color: var(--io_borderColorInset);
        height: var(--io_fieldHeight);
        min-height: var(--io_fieldHeight);
        min-width: calc(var(--io_fieldHeight) * 4);
        flex: 1 1 auto;
      }
      :host:focus {
        @apply --io_focus;
      }
    `;
    }
    static get Frag() {
        return /* glsl */ `
    uniform float uPlayheadX;
    uniform float uRangeStartX;
    uniform float uRangeEndX;
    uniform float uDividerOffsetX;
    uniform float uMinorSpacing;
    uniform float uMediumSpacing;
    uniform float uMajorSpacing;

    float dividers(float x, float spacing, float lineWidth) {
      float distance = abs(fract((x - uDividerOffsetX) / spacing + 0.5) - 0.5) * spacing;
      return distance < lineWidth * 0.5 ? 1.0 : 0.0;
    }

    void main(void) {
      vec2 position = gl_FragCoord.xy;
      float height = uSize.y * uPxRatio;
      float lineWidth = max(1.0, floor(io_borderWidth * uPxRatio));

      float inRange = step(uRangeStartX, position.x) * step(position.x, uRangeEndX);
      vec3 finalCol = mix(io_bgColor.rgb, io_bgColorInput.rgb, inRange);

      float minor = dividers(position.x, uMinorSpacing, lineWidth) * step(position.y, height * 0.25);
      float medium = dividers(position.x, uMediumSpacing, lineWidth) * step(position.y, height * 0.5);
      float major = dividers(position.x, uMajorSpacing, lineWidth);
      finalCol = compose(finalCol, vec4(io_color.rgb, max(max(minor * 0.25, medium * 0.4), major * 0.6)));

      float playhead = step(abs(position.x - uPlayheadX), lineWidth);
      finalCol = compose(finalCol, vec4(io_bgColorBlue.rgb, playhead));

      gl_FragColor = vec4(finalCol, 1.0);
    }`;
    }
    static get Listeners() {
        return {
            'pointerdown': 'onPointerdown',
            'wheel': ['onWheel', { passive: false }],
            'keydown': 'onKeydown',
            'contextmenu': 'onContextmenu',
        };
    }
    constructor(args = {}) { super(args); }
    ready() {
        this.ariaValueMin = '0';
        this.timelineChanged();
    }
    timelineChanged() {
        this._updateAria();
        this.fitView();
    }
    timelineMutated(event) {
        this._updateAria();
        if (event.detail.properties.includes('duration'))
            this.fitView();
        this.debounce(this.onRender);
    }
    /** Shows the whole range. */
    fitView() {
        this.setView(0, Math.max(this.timeline.duration, MIN_VIEW_FRAMES / this.timeline.frameRate));
    }
    /** Sets the view, at least a few frames and at most a few durations long, starting at 0 when the range fits. */
    setView(start, span) {
        span = this._clampSpan(span);
        start = Math.min(Math.max(start, 0), Math.max(this.timeline.duration - span, 0));
        this.setProperties({ viewStart: start, viewEnd: start + span });
    }
    onResized() {
        super.onResized();
        const style = getComputedStyle(this);
        this._font = `${parseFloat(style.fontSize) * 0.8}px ${style.fontFamily}`;
    }
    onContextmenu(event) {
        event.preventDefault();
    }
    onPointerdown(event) {
        if (event.button !== 0)
            return;
        event.stopPropagation();
        this.setPointerCapture(event.pointerId);
        this.addEventListener('pointermove', this.onPointermove);
        this.addEventListener('pointerup', this.onPointerup);
        this.addEventListener('pointercancel', this.onPointerup);
        this.scrubbing = true;
        this._scrubTo(event.clientX);
    }
    onPointermove(event) {
        this.throttle(this.onPointermoveThrottled, event);
    }
    onPointermoveThrottled(event) {
        if (this.scrubbing)
            this._scrubTo(event.clientX);
    }
    onPointerup(event) {
        this.releasePointerCapture(event.pointerId);
        this.removeEventListener('pointermove', this.onPointermove);
        this.removeEventListener('pointerup', this.onPointerup);
        this.removeEventListener('pointercancel', this.onPointerup);
        this.scrubbing = false;
    }
    onWheel(event) {
        event.preventDefault();
        const pixels = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1;
        const span = this.viewEnd - this.viewStart;
        const pan = event.shiftKey ? event.deltaY : event.deltaX;
        if (Math.abs(pan) > Math.abs(event.deltaY) || event.shiftKey) {
            this.setView(this.viewStart + pan * pixels / this.size[0] * span, span);
        }
        else {
            const pivot = this._timeAt(event.clientX);
            const zoomedSpan = this._clampSpan(span * Math.exp(event.deltaY * pixels * 0.002));
            this.setView(pivot - (pivot - this.viewStart) / span * zoomedSpan, zoomedSpan);
        }
    }
    onKeydown(event) {
        const frames = event.shiftKey ? 10 : 1;
        switch (event.key) {
            case 'ArrowLeft':
                this.timeline.stepFrames(-frames);
                break;
            case 'ArrowRight':
                this.timeline.stepFrames(frames);
                break;
            case 'Home':
                this.timeline.currentTime = 0;
                break;
            case 'End':
                this.timeline.currentTime = this.timeline.duration;
                break;
            default:
                return;
        }
        event.preventDefault();
    }
    _updateAria() {
        this.ariaValueNow = String(this.timeline.currentTime);
        this.ariaValueMax = String(this.timeline.duration);
    }
    _clampSpan(span) {
        const minSpan = MIN_VIEW_FRAMES / this.timeline.frameRate;
        return Math.min(Math.max(span, minSpan), Math.max(this.timeline.duration, minSpan) * MAX_VIEW_DURATIONS);
    }
    /** Time under a viewport x coordinate, in seconds. */
    _timeAt(clientX) {
        const x = clientX - this.getBoundingClientRect().left - this.clientLeft;
        return this.viewStart + x / this.size[0] * (this.viewEnd - this.viewStart);
    }
    _scrubTo(clientX) {
        this.timeline.currentTime = this.timeline.snapToFrame(this._timeAt(clientX));
    }
    onRender() {
        const width = this.size[0] * this.pxRatio;
        if (!width || !this.size[1])
            return;
        const { currentTime, duration, frameRate } = this.timeline;
        const secondsPerPixel = (this.viewEnd - this.viewStart) / width;
        const steps = getDividerSteps(frameRate);
        const minorStep = pickDividerStep(steps, MINOR_SPACING * this.pxRatio * secondsPerPixel);
        const mediumStep = pickDividerStep(steps, MEDIUM_SPACING * this.pxRatio * secondsPerPixel, minorStep);
        const majorStep = pickDividerStep(steps, MAJOR_SPACING * this.pxRatio * secondsPerPixel, mediumStep);
        // Pixel positions are computed here in double precision; the shader only repeats them.
        const firstMajor = Math.floor(this.viewStart / majorStep) * majorStep;
        const toPixel = (time) => (time - this.viewStart) / secondsPerPixel;
        this.setShaderProgram();
        this.setUniform('uPlayheadX', toPixel(currentTime));
        this.setUniform('uRangeStartX', toPixel(0));
        this.setUniform('uRangeEndX', toPixel(duration));
        this.setUniform('uDividerOffsetX', toPixel(firstMajor));
        this.setUniform('uMinorSpacing', minorStep / secondsPerPixel);
        this.setUniform('uMediumSpacing', mediumStep / secondsPerPixel);
        this.setUniform('uMajorSpacing', majorStep / secondsPerPixel);
        super.onRender();
        const ctx = this.ctx;
        ctx.font = this._font;
        ctx.fillStyle = this.theme.color.toCss();
        ctx.textBaseline = 'top';
        const inset = 3 * this.pxRatio;
        const count = Math.ceil((this.viewEnd - firstMajor) / majorStep);
        for (let i = 0; i <= count; i++) {
            const time = firstMajor + i * majorStep;
            ctx.fillText(formatTimeLabel(time, majorStep, frameRate), toPixel(time) + inset, inset * 0.5);
        }
    }
};
__decorate([
    Property({ type: Timeline, init: null })
], ThreeTimelineRange.prototype, "timeline", void 0);
__decorate([
    Property({ type: Number, value: 0 })
], ThreeTimelineRange.prototype, "viewStart", void 0);
__decorate([
    Property({ type: Number, value: 10 })
], ThreeTimelineRange.prototype, "viewEnd", void 0);
__decorate([
    Property({ type: Boolean, value: false, reflect: true })
], ThreeTimelineRange.prototype, "scrubbing", void 0);
__decorate([
    Field('slider')
], ThreeTimelineRange.prototype, "role", void 0);
__decorate([
    Field(0)
], ThreeTimelineRange.prototype, "tabIndex", void 0);
__decorate([
    Field('')
], ThreeTimelineRange.prototype, "_font", void 0);
ThreeTimelineRange = __decorate([
    Register
], ThreeTimelineRange);
export { ThreeTimelineRange };
export const threeTimelineRange = function (arg0) {
    return ThreeTimelineRange.vConstructor(arg0);
};

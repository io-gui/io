import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { UniformNode } from 'three/webgpu';
export type TimelineProps = ReactiveObjectProps & {
    currentTime?: number;
    duration?: number;
    frameRate?: number;
    loop?: boolean;
    autoplay?: boolean;
};
/**
 * A document's clock: the current time within `[0, duration]` seconds, the frame rate of stepping and scrubbing,
 * and how playback loops and starts. Playback advances it; the document animates on every change of `currentTime`.
 */
export declare class Timeline extends ReactiveObject {
    /** Seconds from the start: the playhead. */
    currentTime: number;
    /** Length in seconds. Playback wraps or stops here. */
    duration: number;
    /** Frames per second: the unit of frame stepping and scrubbing. */
    frameRate: number;
    /** Whether playback wraps from the end to the start instead of stopping. */
    loop: boolean;
    /**
     * Whether the document plays (`editor.isPlaying`) when opened. The editor does not read it; whatever opens
     * the document sets `isPlaying` from it.
     */
    autoplay: boolean;
    /** Created on first use. Declared: `currentTimeChanged` can run inside the base constructor. */
    private _timeNode;
    constructor(args?: TimelineProps);
    /**
     * `currentTime` as a TSL uniform. Shader animation built on it follows the timeline; TSL's global `time` keeps
     * running while paused and ignores scrubbing.
     */
    get timeNode(): UniformNode<'float', number>;
    currentTimeChanged(): void;
    durationChanged(): void;
    /**
     * Moves `currentTime` forward by `delta` seconds of playback. Past `duration` it wraps to the start when `loop`
     * is set; otherwise it stops at the end and returns `false`.
     */
    advance(delta: number): boolean;
    /** The time of the frame nearest to `time`, within `[0, duration]`. */
    snapToFrame(time: number): number;
    /** Moves `currentTime` by whole frames from the nearest frame, within `[0, duration]`. */
    stepFrames(count: number): void;
}

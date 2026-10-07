import { ReactiveObject, ReactiveObjectProps } from '@io-gui/core';
import { Scene, ToneMapping, WebGPURenderer } from 'three/webgpu';
import { ChangeBus, DocumentChange } from '../editor/ChangeBus.js';
import { FrameInfo, ScheduledTicker } from '../render/RenderScheduler.js';
import type { IoThreeViewport } from '../elements/IoThreeViewport.js';
export type ThreeAppletProps = ReactiveObjectProps & {
    scene?: Scene;
    toneMappingExposure?: number;
    toneMapping?: ToneMapping;
    isPlaying?: boolean;
};
export declare class ThreeApplet extends ReactiveObject implements ScheduledTicker {
    scene: Scene;
    toneMappingExposure: number;
    toneMapping: ToneMapping;
    isPlaying: boolean;
    _renderer: WebGPURenderer | null;
    /** Changes drained by the RenderScheduler each frame; views showing this applet redraw. */
    readonly changeBus: ChangeBus;
    constructor(args?: ThreeAppletProps);
    isPlayingChanged(): void;
    tick(frame: FrameInfo): void;
    notify(change: DocumentChange): void;
    /** Redraws every view showing this applet on the next frame. */
    requestRender(): void;
    isRendererInitialized(): boolean;
    onRendererInitialized(renderer: WebGPURenderer): void;
    /**
     * @deprecated Size belongs to each view (ADR-0002). Called when a viewport showing this applet resizes;
     * with several viewports, the last one resized wins.
     */
    onResized(width: number, height: number, viewport?: IoThreeViewport): void;
    onAnimate(delta: number, time: number): void;
    dispose(): void;
}

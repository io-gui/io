import { IoElement, IoElementProps, ReactivityType, Binding } from '@io-gui/core';
import { WebGPURenderer } from 'three/webgpu';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
export type IoThreeViewportProps = IoElementProps & {
    clearColor?: number | Binding;
    clearAlpha?: number | Binding;
    applet: ThreeApplet | Binding;
    playing?: boolean | Binding;
    cameraSelect?: string | Binding;
    renderer?: WebGPURenderer;
};
export declare class IoThreeViewport extends IoElement {
    width: number;
    height: number;
    visible: boolean;
    clearColor: number;
    clearAlpha: number;
    reactivity: ReactivityType;
    applet: ThreeApplet;
    playing: boolean;
    cameraSelect: string;
    renderer: WebGPURenderer;
    private readonly viewCameras;
    private readonly renderTarget;
    static get Style(): string;
    constructor(args: IoThreeViewportProps);
    connectedCallback(): void;
    disconnectedCallback(): void;
    playingChanged(): void;
    onAnimate(): void;
    onResized(): void;
    appletChanged(): void;
    appletMutated(): void;
    changed(): void;
    renderViewport(): void;
    dispose(): void;
}
export declare const ioThreeViewport: (arg0: IoThreeViewportProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoThreeViewport.d.ts.map
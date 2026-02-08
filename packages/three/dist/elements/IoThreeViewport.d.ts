import { IoElement, IoElementProps, ReactivityType, Change, WithBinding } from '@io-gui/core';
import { WebGPURenderer, Vector2, Vector3 } from 'three/webgpu';
import { ThreeApplet } from '../nodes/ThreeApplet.js';
import { ViewCameras } from '../nodes/ViewCameras.js';
import { ToolBase } from '../nodes/ToolBase.js';
export interface Pointer3D {
    screen: Vector2;
    origin: Vector3;
    direction: Vector3;
    event: PointerEvent;
}
export type IoThreeViewportProps = IoElementProps & {
    overscan?: WithBinding<number>;
    clearColor?: WithBinding<number>;
    clearAlpha?: WithBinding<number>;
    applet: WithBinding<ThreeApplet>;
    cameraSelect?: WithBinding<string>;
    renderer?: WebGPURenderer;
    tool?: WithBinding<ToolBase>;
};
export declare class IoThreeViewport extends IoElement {
    width: number;
    height: number;
    visible: boolean;
    overscan: number;
    clearColor: number;
    clearAlpha: number;
    reactivity: ReactivityType;
    applet: ThreeApplet;
    cameraSelect: string;
    renderer: WebGPURenderer;
    viewCameras: ViewCameras;
    tool: ToolBase;
    tabIndex: number;
    private readonly renderTarget;
    static get Style(): string;
    static get Listeners(): {
        'three-applet-needs-render': string;
    };
    constructor(args: IoThreeViewportProps);
    connectedCallback(): void;
    disconnectedCallback(): void;
    toolChanged(change: Change<ToolBase>): void;
    onAppletNeedsRender(event: CustomEvent): void;
    onResized(): void;
    appletChanged(): void;
    appletMutated(): void;
    viewCamerasMutated(): void;
    changed(): void;
    renderViewportDebounced(): void;
    renderViewport(): void;
    pointerTo3D(event: PointerEvent): Pointer3D;
    dispose(): void;
}
export declare const ioThreeViewport: (arg0: IoThreeViewportProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoThreeViewport.d.ts.map
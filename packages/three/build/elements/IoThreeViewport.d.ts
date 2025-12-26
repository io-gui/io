import { IoElement, IoElementProps, ReactivityType, Binding } from 'io-core';
import { ThreeState } from '../nodes/ThreeState.js';
export type IoThreeViewportProps = IoElementProps & {
    state: ThreeState | Binding<ThreeState>;
    cameraSelect?: string | Binding<string>;
    playing?: boolean | Binding<boolean>;
    clearColor?: number | Binding<number>;
    clearAlpha?: number | Binding<number>;
};
export declare class IoThreeViewport extends IoElement {
    width: number;
    height: number;
    visible: boolean;
    clearColor: number;
    clearAlpha: number;
    reactivity: ReactivityType;
    state: ThreeState;
    playing: boolean;
    cameraSelect: string;
    private readonly viewCameras;
    private readonly renderTarget;
    static get Style(): string;
    constructor(args: IoThreeViewportProps);
    connectedCallback(): void;
    disconnectedCallback(): void;
    playingChanged(): void;
    onAnimate(time: number): void;
    onResized(): void;
    stateChanged(): void;
    stateMutated(): void;
    changed(): void;
    renderViewport(): void;
    dispose(): void;
}
export declare const ioThreeViewport: (arg0: IoThreeViewportProps) => import("io-core").VDOMElement;
//# sourceMappingURL=IoThreeViewport.d.ts.map
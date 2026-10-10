import { ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { BufferGeometry, type NormalOrGLBufferAttributes } from 'three/webgpu';
export type ThreeBuildGeometryProps = ReactiveElementProps & {
    value?: WithBinding<BufferGeometry<NormalOrGLBufferAttributes>>;
};
export declare class ThreeBuildGeometry extends ReactiveElement {
    value: BufferGeometry<NormalOrGLBufferAttributes> | null;
    static get Style(): string;
    constructor(args?: ThreeBuildGeometryProps);
    buildGeometry(): void;
    mutated(): void;
}
export declare const threeBuildGeometry: (arg0?: ThreeBuildGeometryProps) => import("@io-gui/core").VDOMElement;

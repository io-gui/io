import { ReactiveElement, IoElementProps, WithBinding } from '@io-gui/core';
import { BufferGeometry, type NormalOrGLBufferAttributes } from 'three/webgpu';
export type IoBuildGeometryProps = IoElementProps & {
    value?: WithBinding<BufferGeometry<NormalOrGLBufferAttributes>>;
};
export declare class IoBuildGeometry extends ReactiveElement {
    value: BufferGeometry<NormalOrGLBufferAttributes> | null;
    static get Style(): string;
    constructor(args?: IoBuildGeometryProps);
    buildGeometry(): void;
    mutated(): void;
}
export declare const ioBuildGeometry: (arg0?: IoBuildGeometryProps) => import("@io-gui/core").VDOMElement;

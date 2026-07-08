import { ReactiveElement, ReactiveElementProps } from '@io-gui/core';
import { Vector4 } from 'three/webgpu';
export type IoVectorBaseProps = ReactiveElementProps & {
    value?: Vector4;
    conversion?: number;
    step?: number;
    min?: number;
    max?: number;
    linkable?: boolean;
    linked?: boolean;
    ladder?: boolean;
    disabled?: boolean;
};
export declare class IoVectorBase extends ReactiveElement {
    static get Style(): string;
    value: object;
    conversion: number;
    step: number;
    min: number;
    max: number;
    linkable: boolean;
    linked: boolean;
    ladder: boolean;
    disabled: boolean;
    keys: Array<string>;
    _ratios: any;
    constructor(args: IoVectorBaseProps);
    _onNumberPointerDown(event: PointerEvent): void;
    _onNumberValueInput(event: CustomEvent): void;
    valueMutated(): void;
    mutated(): void;
}

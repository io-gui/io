import { WithBinding } from '../nodes/ReactiveObject.js';
import { ReactiveElement, IoElementProps } from './ReactiveElement.js';
type IoSpanProps = IoElementProps & {
    value?: WithBinding<string>;
};
/** Inline text element; `value` updates `innerText`. */
export declare class IoSpan extends ReactiveElement {
    constructor(props: IoSpanProps);
    static get Style(): string;
    value: string;
    valueChanged(): void;
}
export declare const ioSpan: (props?: IoSpanProps) => import("../index.js").VDOMElement;
export {};

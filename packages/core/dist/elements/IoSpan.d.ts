import { WithBinding } from '../nodes/ReactiveObject.js';
import { ReactiveElement, ReactiveElementProps } from './ReactiveElement.js';
type IoSpanProps = ReactiveElementProps & {
    value?: WithBinding<string>;
};
/** Inline text element; `value` updates `innerText`. */
export declare class IoSpan extends ReactiveElement {
    constructor(props: IoSpanProps);
    static get Style(): string;
    value: WithBinding<string>;
    valueChanged(): void;
}
export declare const ioSpan: (props?: IoSpanProps) => import("../index.js").VDOMElement;
export {};

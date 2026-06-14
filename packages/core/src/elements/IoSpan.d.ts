import { WithBinding } from '../nodes/ReactiveNode.js';
import { IoElement, IoElementProps } from './IoElement.js';
type IoSpanProps = IoElementProps & {
    value?: WithBinding<string>;
};
export declare class IoSpan extends IoElement {
    constructor(props: IoSpanProps);
    static get Style(): string;
    value: string;
    valueChanged(): void;
}
export declare const ioSpan: (props?: IoSpanProps) => import("../index.js").VDOMElement;
export {};
//# sourceMappingURL=IoSpan.d.ts.map
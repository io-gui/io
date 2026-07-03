import { VDOMElement, ReactiveElement, ReactiveElementProps, WithBinding } from '@io-gui/core';
import { Layout } from '../nodes/Layout.js';
export type IoLayoutData = ReactiveElementProps & {
    layout: WithBinding<Layout>;
    elements: VDOMElement[];
};
export declare class IoLayout extends ReactiveElement {
    static get Style(): string;
    layout: Layout;
    elements: VDOMElement[];
    layoutMutated(): void;
    mutated(): void;
}
export declare const ioLayout: (arg0: IoLayoutData) => VDOMElement;

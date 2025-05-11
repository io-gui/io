import { VDOMElement } from 'io-gui';
import { IoButton, IoButtonProps } from 'io-inputs';
export type IoPropertyLinkProps = IoButtonProps & {
    value?: Object;
    showName?: boolean;
};
export declare class IoPropertyLink extends IoButton {
    static vConstructor: (arg0?: IoPropertyLinkProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: Object;
    showName: boolean;
    appearance: 'inset' | 'outset' | 'neutral';
    valueMutated(): void;
    changed(): void;
}
export declare const ioPropertyLink: (arg0?: IoPropertyLinkProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoPropertyLink.d.ts.map
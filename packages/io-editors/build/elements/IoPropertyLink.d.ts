import { IoButton, IoButtonProps } from 'io-inputs';
export type IoPropertyLinkProps = IoButtonProps & {
    value?: Object;
    showName?: boolean;
};
export declare class IoPropertyLink extends IoButton {
    static get Style(): string;
    value: Object;
    showName: boolean;
    appearance: 'inset' | 'outset' | 'neutral';
    valueMutated(): void;
    changed(): void;
}
export declare const ioPropertyLink: (arg0?: IoPropertyLinkProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoPropertyLink.d.ts.map
import { IoButton, IoButtonProps } from '@io-gui/inputs';
export type IoPropertyLinkProps = IoButtonProps & {
    value?: object;
    showName?: boolean;
};
export declare class IoPropertyLink extends IoButton {
    static get Style(): string;
    value: object;
    showName: boolean;
    appearance: 'inset' | 'outset' | 'neutral';
    valueMutated(): void;
    changed(): void;
}
export declare const ioPropertyLink: (arg0?: IoPropertyLinkProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoPropertyLink.d.ts.map
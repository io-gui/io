import { IoElement, IoElementProps, WithBinding, VDOMElement } from 'io-gui';
export type IoMarkdownProps = IoElementProps & {
    src?: string;
    strip?: string[];
    loading?: WithBinding<boolean>;
    sanitize?: boolean;
};
/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
export declare class IoMarkdown extends IoElement {
    static vConstructor: (arg0?: IoMarkdownProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    src: string;
    strip: string[];
    loading: boolean;
    sanitize: boolean;
    role: string;
    constructor(args?: IoMarkdownProps);
    protected _strip(innerHTML: string): string;
    protected _parseMarkdown(markdown: string): void;
    onResized(): void;
    srcChanged(): void;
    changed(): void;
}
export declare const ioMarkdown: (arg0?: IoMarkdownProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMarkdown.d.ts.map
import { IoElement, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
export type IoMarkdownArgs = IoElementArgs & ArgsWithBinding<{
    src?: string;
    strip?: string[];
    loading?: boolean;
    sanitize?: boolean;
}>;
/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
export declare class IoMarkdown extends IoElement {
    static vConstructor: (arg0?: IoMarkdownArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    role: string;
    src: string;
    strip: string[];
    loading: boolean;
    sanitize: boolean;
    constructor(args?: IoMarkdownArgs);
    protected _strip(innerHTML: string): string;
    protected _parseMarkdown(markdown: string): void;
    onResized(): void;
    srcChanged(): void;
    changed(): void;
}
export declare const ioMarkdown: (arg0?: IoMarkdownArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoMarkdown.d.ts.map
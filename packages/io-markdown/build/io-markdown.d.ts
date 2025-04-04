import { IoElement, IoElementArgs, ArgsWithBinding, VDOMArray } from 'io-gui';
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
    static get Style(): string;
    role: string;
    src: string;
    strip: string[];
    loading: boolean;
    sanitize: boolean;
    protected _strip(innerHTML: string): string;
    protected _parseMarkdown(markdown: string): void;
    onResized(): void;
    srcChanged(): void;
    changed(): void;
    static vDOM: (arg0?: IoMarkdownArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
}
export declare const ioMarkdown: (arg0?: IoMarkdownArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-markdown.d.ts.map
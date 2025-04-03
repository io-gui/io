import { IoElement } from 'io-gui';
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
}
export declare const ioMarkdown: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-markdown.d.ts.map
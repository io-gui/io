import { IoElement, IoElementProps, WithBinding } from 'io-gui';
export type IoMarkdownProps = IoElementProps & {
    src?: string;
    strip?: string[];
    loading?: WithBinding<boolean>;
    sanitize?: boolean;
    scroll?: WithBinding<string>;
};
/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
export declare class IoMarkdown extends IoElement {
    static get Style(): string;
    src: string;
    strip: string[];
    loading: boolean;
    sanitize: boolean;
    role: string;
    constructor(args?: IoMarkdownProps);
    onResized(): void;
    srcChanged(): void;
}
export declare const ioMarkdown: (arg0?: IoMarkdownProps) => import("io-gui").VDOMElement;
//# sourceMappingURL=IoMarkdown.d.ts.map
import { IoElement } from '../../core/element.js';
/**
 * This elements loads a markdown file from path specified as `src` property and renders it as HTML using marked and dompurify.
 */
export declare class IoMdView extends IoElement {
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
//# sourceMappingURL=io-md-view.d.ts.map
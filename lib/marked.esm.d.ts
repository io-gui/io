export default marked_1;
/**
 * Marked
 */
declare function marked_1(src: any, opt: any, callback: any): any;
declare namespace marked_1 {
    export function options(opt: any): typeof marked;
    export function setOptions(opt: any): typeof marked;
    export { getDefaults };
    export { defaults$5 as defaults };
    export { Parser_1 as Parser };
    import parser = Parser.parse;
    export { parser };
    export { Renderer_1 as Renderer };
    export { TextRenderer_1 as TextRenderer };
    export { Lexer_1 as Lexer };
    import lexer = Lexer.lex;
    export { lexer };
    export { InlineLexer_1 as InlineLexer };
    import inlineLexer = InlineLexer.output;
    export { inlineLexer };
    export { Slugger_1 as Slugger };
    export { marked as parse };
}
/**
 * Marked
 */
declare function marked(src: any, opt: any, callback: any): any;
declare namespace marked { }
declare const getDefaults: any;
declare const defaults$5: any;
/**
 * Parsing & Compiling
 */
declare let Parser_1: {
    new (options: any): {
        tokens: any[];
        token: any;
        options: any;
        renderer: any;
        slugger: {
            seen: {};
            /**
             * Convert string to unique id
             */
            slug(value: any): any;
        };
        /**
         * Parse Loop
         */
        parse(tokens: any): string;
        inline: {
            options: any;
            links: any;
            rules: any;
            renderer: any;
            /**
             * Lexing/Compiling
             */
            output(src: any): string;
            inLink: boolean | undefined;
            inRawBlock: boolean | undefined;
            /**
             * Compile Link
             */
            outputLink(cap: any, link: any): any;
            /**
             * Smartypants Transformations
             */
            smartypants(text: any): any;
            /**
             * Mangle Links
             */
            mangle(text: any): any;
        } | undefined;
        inlineText: {
            options: any;
            links: any;
            rules: any;
            renderer: any;
            /**
             * Lexing/Compiling
             */
            output(src: any): string;
            inLink: boolean | undefined;
            inRawBlock: boolean | undefined;
            /**
             * Compile Link
             */
            outputLink(cap: any, link: any): any;
            /**
             * Smartypants Transformations
             */
            smartypants(text: any): any;
            /**
             * Mangle Links
             */
            mangle(text: any): any;
        } | undefined;
        /**
         * Next Token
         */
        next(): any;
        /**
         * Preview Next Token
         */
        peek(): any;
        /**
         * Parse Text Tokens
         */
        parseText(): string;
        /**
         * Parse Current Token
         */
        tok(): any;
    };
    /**
     * Static Parse Method
     */
    parse(tokens: any, options: any): string;
};
/**
 * Renderer
 */
declare let Renderer_1: {
    new (options: any): {
        options: any;
        code(code: any, infostring: any, escaped: any): string;
        blockquote(quote: any): string;
        html(html: any): any;
        heading(text: any, level: any, raw: any, slugger: any): string;
        hr(): "<hr/>\n" | "<hr>\n";
        list(body: any, ordered: any, start: any): string;
        listitem(text: any): string;
        checkbox(checked: any): string;
        paragraph(text: any): string;
        table(header: any, body: any): string;
        tablerow(content: any): string;
        tablecell(content: any, flags: any): string;
        strong(text: any): string;
        em(text: any): string;
        codespan(text: any): string;
        br(): "<br/>" | "<br>";
        del(text: any): string;
        link(href: any, title: any, text: any): any;
        image(href: any, title: any, text: any): any;
        text(text: any): any;
    };
};
/**
 * TextRenderer
 * returns only the textual part of the token
 */
declare let TextRenderer_1: {
    new (): {
        strong(text: any): any;
        em(text: any): any;
        codespan(text: any): any;
        del(text: any): any;
        html(text: any): any;
        text(text: any): any;
        link(href: any, title: any, text: any): string;
        image(href: any, title: any, text: any): string;
        br(): string;
    };
};
/**
 * Block Lexer
 */
declare let Lexer_1: {
    new (options: any): {
        tokens: any[];
        options: any;
        rules: any;
        /**
         * Preprocessing
         */
        lex(src: any): any[];
        /**
         * Lexing
         */
        token(src: any, top: any): any[];
    };
    /**
     * Expose Block Rules
     */
    readonly rules: {
        newline: RegExp;
        code: RegExp;
        fences: RegExp;
        hr: RegExp;
        heading: RegExp;
        blockquote: RegExp;
        list: RegExp;
        html: string;
        def: RegExp;
        nptable: {
            exec: () => void;
        };
        table: {
            exec: () => void;
        };
        lheading: RegExp;
        _paragraph: RegExp;
        text: RegExp;
    };
    /**
     * Static Lex Method
     */
    lex(src: any, options: any): any[];
};
/**
 * Inline Lexer & Compiler
 */
declare let InlineLexer_1: {
    new (links: any, options: any): {
        options: any;
        links: any;
        rules: any;
        renderer: any;
        /**
         * Lexing/Compiling
         */
        output(src: any): string;
        inLink: boolean | undefined;
        inRawBlock: boolean | undefined;
        /**
         * Compile Link
         */
        outputLink(cap: any, link: any): any;
        /**
         * Smartypants Transformations
         */
        smartypants(text: any): any;
        /**
         * Mangle Links
         */
        mangle(text: any): any;
    };
    /**
     * Expose Inline Rules
     */
    readonly rules: {
        escape: RegExp;
        autolink: RegExp;
        url: {
            exec: () => void;
        };
        tag: string;
        link: RegExp;
        reflink: RegExp;
        nolink: RegExp;
        strong: RegExp;
        em: RegExp;
        code: RegExp;
        br: RegExp;
        del: {
            exec: () => void;
        };
        text: RegExp;
    };
    /**
     * Static Lexing/Compiling Method
     */
    output(src: any, links: any, options: any): string;
    escapes(text: any): any;
};
/**
 * Slugger generates header id
 */
declare let Slugger_1: {
    new (): {
        seen: {};
        /**
         * Convert string to unique id
         */
        slug(value: any): any;
    };
};
//# sourceMappingURL=marked.esm.d.ts.map
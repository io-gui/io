import { VDOMElement } from 'io-gui';
import { IoPropertyEditor, IoPropertyEditorProps } from './IoPropertyEditor.js';
type IoContextEditorProps = IoPropertyEditorProps & {
    expanded?: boolean;
};
interface IoContextEditorExpandProps {
    value: any;
    properties?: string[];
    labeled?: boolean;
    orientation?: 'vertical' | 'horizontal';
}
declare class IoContextEditor extends IoPropertyEditor {
    static vConstructor: (arg0?: IoContextEditorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    expanded: boolean;
    static get Listeners(): {
        keydown: string;
        'io-focus-to': string;
    };
    onKeydown(event: KeyboardEvent): void;
    onIoFocusTo(event: CustomEvent): void;
    expand(props: IoContextEditorExpandProps): void;
    onExpand(): void;
    expandedChanged(): void;
}
export declare const IoContextEditorSingleton: IoContextEditor;
export {};
//# sourceMappingURL=IoContextEditorSingleton.d.ts.map
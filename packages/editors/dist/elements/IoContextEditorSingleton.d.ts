import { NudgeDirection } from '@io-gui/core';
import { IoPropertyEditor, IoPropertyEditorProps } from './IoPropertyEditor.js';
type IoContextEditorExpandProps = IoPropertyEditorProps & {
    source: HTMLElement;
    direction: NudgeDirection;
    value: any;
    onClose?: () => void;
};
declare class IoContextEditor extends IoPropertyEditor {
    static get Style(): string;
    expanded: boolean;
    onClose: null | (() => void);
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
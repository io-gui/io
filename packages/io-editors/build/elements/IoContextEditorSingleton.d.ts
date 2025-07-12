import { NudgeDirection } from 'io-gui';
import { IoPropertyEditor } from './IoPropertyEditor.js';
import { EditorGroups } from '../utils/EditorGroups.js';
import { EditorWidgets } from '../utils/EditorWidgets.js';
import { EditorConfig } from '../utils/EditorConfig.js';
interface IoContextEditorExpandProps {
    source: HTMLElement;
    direction: NudgeDirection;
    value: any;
    properties?: string[];
    labeled?: boolean;
    orientation?: 'vertical' | 'horizontal';
    config?: EditorConfig;
    groups?: EditorGroups;
    widgets?: EditorWidgets;
    onClose?: () => void;
}
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
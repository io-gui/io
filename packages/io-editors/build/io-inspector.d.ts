import { IoNode, IoElement } from 'io-gui';
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsible` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
export declare class IoInspector extends IoElement {
    static get Style(): string;
    value: Record<string, any> | any[];
    selected: Record<string, any> | any[];
    uuid: string;
    search: string;
    groups: Record<string, any>;
    widgets: Record<string, any>;
    static get Listeners(): {
        'io-field-clicked': string;
    };
    _onItemClicked(event: CustomEvent): void;
    valueChanged(): void;
    advancedChanged(): void;
    selectedMutated(): void;
    changed(): void;
    _onChangedThrottled(): void;
    _onChange(): void;
    static get ObjectGroups(): {
        'Object|hidden': RegExp[];
        'Array|main': RegExp[];
        'HTMLElement|main': (string | RegExp)[];
        'HTMLElement|hidden': (string | RegExp)[];
        'HTMLElement|content': RegExp[];
        'HTMLElement|display': RegExp[];
        'HTMLElement|hierarchy': RegExp[];
    };
    static get ObjectWidgets(): {};
    Register(ioNodeConstructor: typeof IoNode): void;
}
export declare const ioInspector: (arg0?: import("io-gui").IoElementArgs | import("io-gui").VDOMArray[] | string, arg1?: import("io-gui").VDOMArray[] | string) => import("io-gui").VDOMArray;
//# sourceMappingURL=io-inspector.d.ts.map
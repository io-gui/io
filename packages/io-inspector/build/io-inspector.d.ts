import { IoNode, IoElement } from 'io-gui';
import './io-breadcrumbs.js';
/**
 * Object property editor. It displays a set of labeled property editors for the `value` object inside multiple `io-collapsable` elements. It can be configured to use custom property editors and display only specified properties. Properties of type `Object` are displayed as clickable links which can also be navigated in the `io-breadcrumbs` element.
 **/
export declare class IoInspector extends IoElement {
    static get Style(): string;
    value: Record<string, any> | any[];
    selected: Record<string, any> | any[];
    config: Record<string, any>;
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
    static get Config(): (ObjectConstructor | ((string[] | BooleanConstructor)[] | ((string | {
        appearance: string;
        class: string;
    })[] | null)[] | ((string | {
        appearance: string;
    })[] | undefined)[] | (StringConstructor | (string | {
        appearance: string;
    })[])[] | (NumberConstructor | (string | {
        appearance: string;
        step: number;
    })[])[] | (ObjectConstructor | (string | {
        appearance: string;
        class: string;
    })[])[])[])[][];
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
//# sourceMappingURL=io-inspector.d.ts.map
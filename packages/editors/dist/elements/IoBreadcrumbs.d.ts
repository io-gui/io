import { IoElement, IoElementProps, WithBinding } from '@io-gui/core';
export type IoBreadcrumbsProps = IoElementProps & {
    value?: Object;
    selected?: WithBinding<Object>;
    search?: WithBinding<string>;
};
/**
 * Breadcrumbs select element.
 * When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value.
 * Optionally, it can trim the `options` array to selected option index.
 **/
export declare class IoBreadcrumbs extends IoElement {
    static get Style(): string;
    value: Object;
    selected: Object;
    search: string;
    _crumbs: Array<Object>;
    valueChanged(): void;
    selectedChanged(): void;
    onClearSearch(): void;
    changed(): void;
}
export declare const ioBreadcrumbs: (arg0?: IoBreadcrumbsProps) => import("@io-gui/core").VDOMElement;
//# sourceMappingURL=IoBreadcrumbs.d.ts.map
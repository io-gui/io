import { IoElement, IoElementProps, PropsWithBinding, VDOMElement } from 'io-gui';
export type IoBreadcrumbsProps = IoElementProps & PropsWithBinding<{
    value?: Object;
    selected?: Object;
    crumbs?: Array<Object>;
    search?: string;
}>;
/**
 * Breadcrumbs select element.
 * When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value.
 * Optionally, it can trim the `options` array to selected option index.
 **/
export declare class IoBreadcrumbs extends IoElement {
    static vConstructor: (arg0?: IoBreadcrumbsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: Object;
    selected: Object;
    crumbs: Array<Object>;
    search: string;
    valueChanged(): void;
    selectedChanged(): void;
    onClearSearch(): void;
    changed(): void;
}
export declare const ioBreadcrumbs: (arg0?: IoBreadcrumbsProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoBreadcrumbs.d.ts.map
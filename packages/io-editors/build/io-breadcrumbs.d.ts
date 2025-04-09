import { IoElement, IoElementArgs, ArgsWithBinding, VDOMElement } from 'io-gui';
export type IoBreadcrumbsArgs = IoElementArgs & ArgsWithBinding<{
    value?: Record<string, any> | any[];
    selected?: any;
    options?: Record<string, any> | any[];
}>;
/**
 * Breadcrumbs select element.
 * When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value.
 * Optionally, it can trim the `options` array to selected option index.
 **/
export declare class IoBreadcrumbs extends IoElement {
    static vConstructor: (arg0?: IoBreadcrumbsArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    value: Record<string, any> | any[];
    selected: any;
    options: any[];
    _onClick(event: CustomEvent): void;
    valueChanged(): void;
    selectedChanged(): void;
    changed(): void;
}
export declare const ioBreadcrumbs: (arg0?: IoBreadcrumbsArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=io-breadcrumbs.d.ts.map
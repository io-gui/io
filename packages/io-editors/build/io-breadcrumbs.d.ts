import { IoElement, IoElementArgs, ArgsWithBinding, VDOMArray } from 'io-gui';
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
    static vConstructor: (arg0?: IoBreadcrumbsArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
    static get Style(): string;
    value: Record<string, any> | any[];
    selected: any;
    options: any[];
    _onClick(event: CustomEvent): void;
    valueChanged(): void;
    selectedChanged(): void;
    changed(): void;
}
export declare const ioBreadcrumbs: (arg0?: IoBreadcrumbsArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=io-breadcrumbs.d.ts.map
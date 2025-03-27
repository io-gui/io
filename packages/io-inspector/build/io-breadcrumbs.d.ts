import { IoElement } from 'io-gui';
/**
 * Breadcrumbs select element.
 * When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value.
 * Optionally, it can trim the `options` array to selected option index.
 **/
export declare class IoBreadcrumbs extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    _onClick(event: CustomEvent): void;
    valueChanged(): void;
    selectedChanged(): void;
    changed(): void;
}
//# sourceMappingURL=io-breadcrumbs.d.ts.map
import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
import { CachingType, SelectType } from './IoSelector.js';
export type MenuPositionType = 'top' | 'left' | 'right';
export type IoNavigatorProps = IoElementProps & {
    options?: MenuOptions;
    elements?: VDOMElement[];
    widget?: VDOMElement;
    menu?: MenuPositionType;
    depth?: number;
    collapsed?: WithBinding<boolean>;
    collapseWidth?: number;
    select?: SelectType;
    caching?: CachingType;
    scroll?: WithBinding<string>;
};
export declare class IoNavigator extends IoElement {
    static vConstructor: (arg0?: IoNavigatorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    elements: VDOMElement[];
    options: MenuOptions;
    widget: VDOMElement | null;
    menu: MenuPositionType;
    depth: number;
    collapsed: boolean;
    collapseWidth: number;
    select: SelectType;
    caching: CachingType;
    scroll: string;
    changed(): void;
}
export declare const ioNavigator: (arg0?: IoNavigatorProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoNavigator.d.ts.map
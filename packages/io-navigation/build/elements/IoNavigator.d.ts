import { IoElement, VDOMElement, IoElementProps, WithBinding } from 'io-gui';
import { MenuOptions } from 'io-menus';
import { CachingType } from './IoSelector.js';
export type MenuPositionType = 'top' | 'left' | 'right';
export type SelectType = 'shallow' | 'deep' | 'all' | 'none';
export type IoNavigatorProps = IoElementProps & {
    options?: MenuOptions;
    elements?: VDOMElement[];
    widget?: VDOMElement;
    menu?: MenuPositionType;
    depth?: number;
    select?: SelectType;
    caching?: CachingType;
    anchor?: WithBinding<string>;
};
export declare class IoNavigator extends IoElement {
    static get Style(): string;
    elements: VDOMElement[];
    options: MenuOptions;
    widget: VDOMElement | null;
    menu: MenuPositionType;
    depth: number;
    select: SelectType;
    caching: CachingType;
    anchor: string;
    optionsMutated(): void;
    changed(): void;
}
export declare const ioNavigator: (arg0?: IoNavigatorProps) => VDOMElement;
//# sourceMappingURL=IoNavigator.d.ts.map
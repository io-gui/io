import { IoString } from '@io-gui/inputs';
import { IoMenuItem } from '../elements/IoMenuItem.js';
import { IoMenuOptions } from '../elements/IoMenuOptions.js';
import { IoMenuTree } from '../elements/IoMenuTree.js';
export type IoMenuElementType = IoMenuItem | IoMenuOptions | IoMenuTree | IoString;
export declare function getHoveredMenuItem(event: PointerEvent): IoMenuElementType | undefined;
export declare function getMenuDescendants(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuAncestors(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuChildren(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuSiblings(element: IoMenuItem): IoMenuItem[];
export declare function getMenuRoot(element: IoMenuElementType): IoMenuElementType;
export declare function isPointerAboveIoMenuItem(event: PointerEvent, element: IoMenuElementType): boolean;
//# sourceMappingURL=MenuDOMUtils.d.ts.map
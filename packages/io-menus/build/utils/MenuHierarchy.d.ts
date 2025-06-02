import { IoString } from 'io-inputs';
import { IoMenuItem } from '../elements/IoMenuItem';
import { IoMenuOptions } from '../elements/IoMenuOptions';
import { IoMenuTree } from '../elements/IoMenuTree';
export type IoMenuElementType = IoMenuItem | IoMenuOptions | IoMenuTree | IoString;
export declare function getHoveredMenuItem(event: PointerEvent): IoMenuElementType | undefined;
export declare function getMenuDescendants(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuAncestors(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuChildren(element: IoMenuElementType): IoMenuElementType[];
export declare function getMenuSiblings(element: IoMenuItem): IoMenuItem[];
export declare function getMenuRoot(element: IoMenuElementType): IoMenuElementType;
export declare function isPointerAboveIoMenuItem(event: PointerEvent, element: IoMenuElementType): boolean;
//# sourceMappingURL=MenuHierarchy.d.ts.map
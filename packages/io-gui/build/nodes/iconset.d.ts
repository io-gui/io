import { IoNode } from '../core/node';
export declare const IoIconsetDB: Record<string, Record<string, string>>;
/**
 * Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace` and `id` attribute.
 *
 * ```javascript
 * import {IoIconsetSingleton} from "./path_to/io-gui.js";
 * const svgString = `<svg><g id="myicon"><path d="..."/></g></svg>`;
 *
 * // register icons under "custom" namespace
 * IoIconsetSingleton.registerIcons('custom', svgString);
 * // retrieve specific icon
 * const icon = IoIconsetSingleton.getIcon('custom:myicon');
 * ```
 **/
declare class IoIconset extends IoNode {
    registerIcons(name: string, svg: string): void;
    getIcon(icon: string): string;
}
export declare const IoIconsetSingleton: IoIconset;
export {};
//# sourceMappingURL=iconset.d.ts.map
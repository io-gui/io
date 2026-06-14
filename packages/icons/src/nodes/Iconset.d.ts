import { ReactiveNode } from '@io-gui/core';
export declare const IconsetDB: Record<string, Record<string, string>>;
/**
 * Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace:id` attribute.
 **/
declare class Iconset extends ReactiveNode {
    registerIcons(name: string, svg: string): void;
    getIcon(icon: string): string;
}
export declare const IconsetSingleton: Iconset;
export {};
//# sourceMappingURL=Iconset.d.ts.map
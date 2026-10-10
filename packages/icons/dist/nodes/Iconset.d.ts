import { ReactiveObject } from '@io-gui/core';
export declare const IconsetDB: Record<string, Record<string, string>>;
/**
 * Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace:id` attribute.
 **/
declare class Iconset extends ReactiveObject {
    registerIcons(name: string, svg: string): void;
    /** Whether `icon` (`namespace:id`) is registered. */
    hasIcon(icon: string): boolean;
    /** SVG markup of `icon` (`namespace:id`); an empty icon when it is not registered. */
    getIcon(icon: string): string;
}
export declare const IconsetSingleton: Iconset;
export {};

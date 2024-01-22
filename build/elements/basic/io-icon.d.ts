import { IoElement } from '../../core/element.js';
/**
 * SVG icon element.
 * It displays SVG content specified via `icon` parameter. Custom SVG assets need to be registered with `IoIconsetSingleton`.
 **/
export declare class IoIcon extends IoElement {
    static get Style(): string;
    icon: string;
    stroke: boolean;
    iconChanged(): void;
}
//# sourceMappingURL=io-icon.d.ts.map
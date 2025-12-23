import { IoElement } from '../elements/IoElement';
/**
 * Nudge direction.
 *
 * @description Nudge direction.
 * @example
 *
 */
export type NudgeDirection = 'none' | 'up' | 'left' | 'down' | 'right' | 'over';
export declare function nudge(element: HTMLElement | IoElement, srcElement: HTMLElement | IoElement, direction: NudgeDirection, doClip?: boolean): void;
//# sourceMappingURL=Nudge.d.ts.map
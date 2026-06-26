import { ReactiveElement } from '../elements/ReactiveElement.js';
/**
 * Nudge direction.
 *
 * @description Nudge direction.
 * @example
 *
 */
export type NudgeDirection = 'none' | 'up' | 'left' | 'down' | 'right' | 'over';
export declare function nudge(element: HTMLElement | ReactiveElement, srcElement: HTMLElement | ReactiveElement, direction: NudgeDirection, doClip?: boolean): void;

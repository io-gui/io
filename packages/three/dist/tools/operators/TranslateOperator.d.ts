import { Ray, Vector3 } from 'three/webgpu';
import type { Operator, OperatorContext, OperatorPollContext, OperatorProps, OperatorStatus, OperatorType } from '../Operator.js';
import type { ViewInputEvent } from '../../input/ViewInputEvent.js';
/** Movement constraint: one world axis, or the plane facing the view. */
export type TranslateAxis = 'x' | 'y' | 'z' | 'view';
export type TranslateProps = OperatorProps & {
    axis?: TranslateAxis;
    /** World-space offset. Set when an interactive run finishes, so the command can be repeated with `exec`. */
    delta?: [number, number, number];
};
/** Unit direction of each world axis. */
export declare const AXES: Readonly<Record<Exclude<TranslateAxis, 'view'>, Vector3>>;
/**
 * Moves the selected objects (`transform.translate`). Interactive runs are modal: drag along an axis or in the
 * view plane, X / Y / Z switch the constraint (again to release it), release or Enter confirms, Escape or right
 * click cancels and rolls the transaction back. `exec` applies `props.delta` directly (repeat, scripts).
 */
export declare class TranslateOperator implements Operator {
    readonly props: TranslateProps;
    private _targets;
    private readonly _pivot;
    private _axis;
    private _startRay;
    private _lastRay;
    private readonly _viewNormal;
    private readonly _delta;
    constructor(props: TranslateProps);
    poll(ctx: OperatorPollContext): boolean;
    invoke(ctx: OperatorContext, event?: ViewInputEvent): OperatorStatus;
    modal(ctx: OperatorContext, event: ViewInputEvent): OperatorStatus;
    exec(ctx: OperatorContext): Exclude<OperatorStatus, 'running'>;
    private _collect;
    /** Where `ray` meets the current constraint through the pivot. */
    private _pointOn;
    private _apply;
    private _write;
    private _finish;
}
/** Closest point on the line `origin + s * direction` (unit direction) to `ray`. False when they are parallel. */
export declare function closestPointOnLine(origin: Vector3, direction: Vector3, ray: Ray, out: Vector3): boolean;
export declare const translateOperatorType: OperatorType;

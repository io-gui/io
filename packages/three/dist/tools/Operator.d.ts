import type { ThreeEditor } from '../editor/ThreeEditor.js';
import type { ThreeDocument } from '../editor/ThreeDocument.js';
import type { Transaction } from '../editor/Transaction.js';
import type { ThreeView } from '../view/ThreeView.js';
import type { InputRouter } from '../input/InputRouter.js';
import type { InputHost, ViewInputEvent } from '../input/ViewInputEvent.js';
export type OperatorStatus = 'running' | 'finished' | 'cancelled';
export type OperatorProps = Record<string, unknown>;
/** A viewport an operator can run in: input host plus its router (for modal operators). */
export type OperatorHost = InputHost & {
    readonly inputRouter: InputRouter;
};
export interface OperatorContext {
    readonly editor: ThreeEditor;
    readonly document: ThreeDocument;
    /** Open transaction for this run; committed on `finished`, rolled back on `cancelled`. */
    readonly transaction: Transaction;
    readonly host: OperatorHost | null;
    readonly view: ThreeView | null;
}
export type OperatorPollContext = Omit<OperatorContext, 'transaction'>;
/**
 * One action with one undo record (ADR-0004, ADR-0008). Edits go through `ctx.transaction` only.
 * Short operators implement `exec`. Interactive ones return `'running'` from `invoke` and then receive
 * every viewport event in `modal` until they return `'finished'` or `'cancelled'`.
 */
export interface Operator {
    poll?(ctx: OperatorPollContext): boolean;
    invoke?(ctx: OperatorContext, event?: ViewInputEvent): OperatorStatus;
    modal?(ctx: OperatorContext, event: ViewInputEvent): OperatorStatus;
    exec(ctx: OperatorContext): Exclude<OperatorStatus, 'running'>;
    cancel?(ctx: OperatorContext): void;
}
export interface OperatorType {
    readonly id: string;
    readonly label?: string;
    create(props: OperatorProps): Operator;
}
/**
 * What a finished operator run means as a Maya-style command: a name plus serializable arguments.
 * Recorded now so a command journal, repeat-last and macros can be added later (plan Phase 8).
 */
export interface Command {
    readonly name: string;
    readonly args: OperatorProps;
}
/**
 * Registered operator types of one editor, and the runner. At most one operator runs modally at a time;
 * starting another, or switching documents, cancels it.
 */
export declare class OperatorRegistry {
    private readonly editor;
    private readonly _types;
    private _running;
    private _lastCommand;
    constructor(editor: ThreeEditor);
    register(type: OperatorType): void;
    get(id: string): OperatorType | undefined;
    list(): OperatorType[];
    get running(): Operator | null;
    /** The command equivalent of the last finished run. */
    get lastCommand(): Command | null;
    /**
     * Runs an operator. With a `host`, a modal operator takes over that viewport's input
     * (`InputRouter.startModal`) until it finishes; Escape cancels it.
     */
    run(id: string, props?: OperatorProps, options?: {
        host?: OperatorHost | null;
        event?: ViewInputEvent;
    }): OperatorStatus;
    /** Cancels the running modal operator, rolling back its edits. */
    cancelRunning(): void;
    /** @internal Feeds a viewport event to the running modal operator. */
    _modalEvent(event: ViewInputEvent): void;
    private _settle;
}

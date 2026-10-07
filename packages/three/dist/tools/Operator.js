import { BehaviorPriority } from '../input/Behavior.js';
class ModalOperatorBehavior {
    registry;
    priority = BehaviorPriority.modal;
    modal = true;
    constructor(registry) {
        this.registry = registry;
    }
    wantsCapture() { return false; }
    begin() { }
    end() { }
    update(event) { this.registry._modalEvent(event); }
    cancel() { this.registry.cancelRunning(); }
    key(event) {
        if (event.type === 'keydown' && event.code === 'Escape')
            this.registry.cancelRunning();
        else
            this.registry._modalEvent(event);
        return true;
    }
}
/**
 * Registered operator types of one editor, and the runner. At most one operator runs modally at a time;
 * starting another, or switching documents, cancels it.
 */
export class OperatorRegistry {
    editor;
    _types = new Map();
    _running = null;
    _lastCommand = null;
    constructor(editor) {
        this.editor = editor;
    }
    register(type) {
        debug: {
            if (this._types.has(type.id))
                console.warn(`OperatorRegistry: replacing operator "${type.id}"`);
        }
        this._types.set(type.id, type);
    }
    get(id) {
        return this._types.get(id);
    }
    list() {
        return [...this._types.values()];
    }
    get running() {
        return this._running?.operator ?? null;
    }
    /** The command equivalent of the last finished run. */
    get lastCommand() {
        return this._lastCommand;
    }
    /**
     * Runs an operator. With a `host`, a modal operator takes over that viewport's input
     * (`InputRouter.startModal`) until it finishes; Escape cancels it.
     */
    run(id, props = {}, options = {}) {
        const type = this._types.get(id);
        if (!type) {
            console.error(`OperatorRegistry: no operator "${id}"`);
            return 'cancelled';
        }
        if (this._running)
            this.cancelRunning();
        const host = options.host ?? null;
        const document = this.editor.document;
        const pollContext = { editor: this.editor, document, host, view: host?.view ?? null };
        const operator = type.create(props);
        if (operator.poll && !operator.poll(pollContext))
            return 'cancelled';
        const ctx = { ...pollContext, transaction: document.begin(type.label ?? type.id) };
        let status;
        try {
            status = operator.invoke ? operator.invoke(ctx, options.event) : operator.exec(ctx);
        }
        catch (error) {
            if (ctx.transaction.state === 'open')
                ctx.transaction.rollback();
            throw error;
        }
        if (status !== 'running') {
            this._settle({ type, props, operator, ctx, behavior: null }, status);
            return status;
        }
        debug: {
            if (!operator.modal)
                console.error(`OperatorRegistry: "${id}" returned 'running' but has no modal()`);
        }
        const behavior = host ? new ModalOperatorBehavior(this) : null;
        this._running = { type, props, operator, ctx, behavior };
        if (host && behavior)
            host.inputRouter.startModal(behavior);
        return status;
    }
    /** Cancels the running modal operator, rolling back its edits. */
    cancelRunning() {
        const running = this._running;
        if (!running)
            return;
        this._running = null;
        running.operator.cancel?.(running.ctx);
        this._settle(running, 'cancelled');
    }
    /** @internal Feeds a viewport event to the running modal operator. */
    _modalEvent(event) {
        const running = this._running;
        if (!running?.operator.modal)
            return;
        const status = running.operator.modal(running.ctx, event);
        if (status === 'running')
            return;
        this._running = null;
        this._settle(running, status);
    }
    _settle(run, status) {
        if (run.behavior)
            run.ctx.host?.inputRouter.endModal(run.behavior);
        const transaction = run.ctx.transaction;
        if (transaction.state !== 'open')
            return;
        if (status === 'finished') {
            // Before commit, so commit listeners already see this run as the last command.
            this._lastCommand = { name: run.type.id, args: run.props };
            transaction.commit();
        }
        else {
            transaction.rollback();
        }
    }
}

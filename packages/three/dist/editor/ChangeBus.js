/**
 * Queue of changes drained once per frame by the RenderScheduler.
 * Notifying is cheap and dispatches nothing; redraw happens on the next frame.
 */
export class ChangeBus {
    _queue = [];
    /** Past this many undrained changes (nothing draws the document), the queue collapses to one `other` change. */
    static LIMIT = 10000;
    notify(change) {
        if (this._queue.length >= ChangeBus.LIMIT) {
            this._queue = [{ kind: 'other', source: change.source }];
            return;
        }
        this._queue.push(change);
    }
    /** Drops undrained changes (the document is no longer shown). */
    clear() {
        this._queue = [];
    }
    get pending() {
        return this._queue.length > 0;
    }
    drain() {
        const changes = this._queue;
        this._queue = [];
        return changes;
    }
}

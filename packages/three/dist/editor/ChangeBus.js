/**
 * Queue of changes drained once per frame by the RenderScheduler.
 * Notifying is cheap and dispatches nothing; redraw happens on the next frame.
 */
export class ChangeBus {
    _queue = [];
    notify(change) {
        this._queue.push(change);
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

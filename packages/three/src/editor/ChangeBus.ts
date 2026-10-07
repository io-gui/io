export type ChangeKind = 'transform' | 'geometry' | 'material' | 'structure' | 'selection' | 'settings' | 'time' | 'other'

/**
 * A typed record of something that changed in a document.
 * Views decide whether a change concerns them (`listens(change)`) and get tagged for redraw.
 */
export interface DocumentChange {
  kind: ChangeKind
  /** The document the change belongs to. */
  source: object
  /** Stable ids (`Object3D.uuid`) of the objects that changed, when known. */
  ids?: readonly string[]
}

/**
 * Queue of changes drained once per frame by the RenderScheduler.
 * Notifying is cheap and dispatches nothing; redraw happens on the next frame.
 */
export class ChangeBus {
  private _queue: DocumentChange[] = []

  notify(change: DocumentChange) {
    this._queue.push(change)
  }

  get pending() {
    return this._queue.length > 0
  }

  drain(): DocumentChange[] {
    const changes = this._queue
    this._queue = []
    return changes
  }
}

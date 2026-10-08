export type ChangeKind = 'transform' | 'geometry' | 'material' | 'structure' | 'selection' | 'settings' | 'time' | 'other';
/**
 * A typed record of something that changed in a document.
 * Views decide whether a change concerns them (`listens(change)`) and get tagged for redraw.
 */
export interface DocumentChange {
    kind: ChangeKind;
    /** The document the change belongs to. */
    source: object;
    /** Stable ids (`Object3D.uuid`) of the objects that changed, when known. */
    ids?: readonly string[];
}
/**
 * Queue of changes drained once per frame by the RenderScheduler.
 * Notifying is cheap and dispatches nothing; redraw happens on the next frame.
 */
export declare class ChangeBus {
    private _queue;
    /** Past this many undrained changes (nothing draws the document), the queue collapses to one `other` change. */
    static readonly LIMIT = 10000;
    notify(change: DocumentChange): void;
    /** Drops undrained changes (the document is no longer shown). */
    clear(): void;
    get pending(): boolean;
    drain(): DocumentChange[];
}

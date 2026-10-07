export type ChangeKind = 'transform' | 'geometry' | 'material' | 'structure' | 'selection' | 'settings' | 'time' | 'other';
/**
 * A typed record of something that changed in a document or applet.
 * Views decide whether a change concerns them (`listens(change)`) and get tagged for redraw.
 */
export interface DocumentChange {
    kind: ChangeKind;
    /** The document (applet until the editor layer lands) the change belongs to. */
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
    notify(change: DocumentChange): void;
    get pending(): boolean;
    drain(): DocumentChange[];
}

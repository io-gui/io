const _overlays = new Map();
/** Registers an overlay type. Replaces one with the same id. */
export function registerOverlay(type) {
    _overlays.set(type.id, type);
}
export function getOverlayType(id) {
    return _overlays.get(id);
}
/** Registered overlay types for a view kind, in draw order. */
export function listOverlays(viewKind) {
    return [..._overlays.values()]
        .filter(type => !viewKind || type.viewKinds.includes(viewKind))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

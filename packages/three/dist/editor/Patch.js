const TRANSFORM_PATHS = ['position', 'quaternion', 'rotation', 'scale', 'matrix', 'up'];
export function changeKindForPatch(patch) {
    if (patch.op === 'insert' || patch.op === 'remove')
        return 'structure';
    const head = patch.path.split('.')[0];
    if (TRANSFORM_PATHS.includes(head))
        return 'transform';
    if (head === 'material')
        return 'material';
    if (head === 'geometry')
        return 'geometry';
    return 'other';
}
export function invertPatch(patch) {
    switch (patch.op) {
        case 'set':
        case 'copy': return { ...patch, value: patch.oldValue, oldValue: patch.value };
        case 'insert': return { op: 'remove', parentId: patch.parentId, index: patch.index, object: patch.object };
        case 'remove': return { op: 'insert', parentId: patch.parentId, index: patch.index, object: patch.object };
    }
}
/** The value a patch of `op` records: `copy` snapshots it, since the object it is copied into changes later. */
export function patchValue(op, value) {
    return op === 'copy' ? value.clone() : value;
}
export function resolvePath(root, path) {
    const segments = path.split('.');
    const key = segments.pop();
    let owner = root;
    for (const segment of segments) {
        owner = owner[segment];
        if (owner === undefined || owner === null)
            throw new Error(`Patch: path "${path}" does not resolve`);
    }
    return { owner, key };
}
/**
 * Applies a value patch: `set` assigns, `copy` copies into the held object. Assigning a read-only property
 * (`Object3D.position`, `rotation`, `quaternion`, `scale`) throws; those are written with `copy`.
 */
export function writeValue(op, owner, key, value) {
    if (op === 'set')
        owner[key] = value;
    else
        owner[key].copy(value);
}
export function insertChild(parent, object, index) {
    parent.add(object);
    const children = parent.children;
    children.splice(children.indexOf(object), 1);
    children.splice(Math.min(Math.max(index, 0), children.length), 0, object);
}

const TRANSFORM_PATHS = ['position', 'quaternion', 'rotation', 'scale', 'matrix', 'up'];
export function changeKindForPatch(patch) {
    if (patch.op !== 'set')
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
        case 'set': return { op: 'set', id: patch.id, path: patch.path, value: patch.oldValue, oldValue: patch.value };
        case 'insert': return { op: 'remove', parentId: patch.parentId, index: patch.index, object: patch.object };
        case 'remove': return { op: 'insert', parentId: patch.parentId, index: patch.index, object: patch.object };
    }
}
/** Snapshot of a value: math objects are cloned, arrays sliced, everything else kept as is. */
export function cloneValue(value) {
    if (Array.isArray(value))
        return value.slice();
    if (value && typeof value.clone === 'function' && typeof value.copy === 'function') {
        return value.clone();
    }
    return value;
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
 * Writes a value in place. Math objects (`Vector3`, `Euler`, `Color`, ...) are copied into the existing
 * instance, because Three.js relies on their identity (`object.position` is read-only).
 */
export function writeValue(owner, key, value) {
    const current = owner[key];
    if (current && value && typeof current.copy === 'function' && value.constructor === current.constructor) {
        current.copy(value);
    }
    else {
        owner[key] = value;
    }
}
export function insertChild(parent, object, index) {
    parent.add(object);
    const children = parent.children;
    children.splice(children.indexOf(object), 1);
    children.splice(Math.min(Math.max(index, 0), children.length), 0, object);
}

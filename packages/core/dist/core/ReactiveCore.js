import { ChangeQueue } from './ChangeQueue.js';
import { EventDispatcher } from './EventDispatcher.js';
export function isReactiveNode(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const owner = value;
    return owner._isReactiveObject === true || owner._isReactiveElement === true;
}
export function initReactiveNodeInternals(owner) {
    Object.defineProperty(owner, '_changeQueue', { enumerable: false, configurable: true, value: new ChangeQueue(owner) });
    Object.defineProperty(owner, '_properties', { enumerable: false, configurable: true, value: new Map() });
    Object.defineProperty(owner, '_bindings', { enumerable: false, configurable: true, value: new Map() });
    Object.defineProperty(owner, '_eventDispatcher', { enumerable: false, configurable: true, value: new EventDispatcher(owner) });
    Object.defineProperty(owner, '_parents', { enumerable: false, configurable: true, value: [] });
    Object.defineProperty(owner, '_children', { enumerable: false, configurable: true, value: [] });
    Object.defineProperty(owner, '_hasWindowMutationListener', { enumerable: false, configurable: true, writable: true, value: false });
    Object.defineProperty(owner, '_hasSelfMutationListener', { enumerable: false, configurable: true, writable: true, value: false });
}
export function addParent(child, parent) {
    if (!isReactiveNode(parent))
        return;
    if (!child._parents.includes(parent)) {
        child._parents.push(parent);
        if (!parent._children.includes(child))
            parent._children.push(child);
    }
}
export function removeParent(child, parent) {
    if (child._disposed)
        return;
    if (!isReactiveNode(parent))
        return;
    const index = child._parents.indexOf(parent);
    if (index !== -1) {
        child._parents.splice(index, 1);
        const childIndex = parent._children.indexOf(child);
        if (childIndex !== -1)
            parent._children.splice(childIndex, 1);
    }
    else {
        debug: console.warn('ReactiveNode.removeParent(): Parent not found!', child, parent);
    }
}
export function detachNodeParents(owner) {
    for (let i = owner._children.length; i--;) {
        const child = owner._children[i];
        if (isReactiveNode(child) && !child._disposed) {
            removeParent(child, owner);
        }
    }
}

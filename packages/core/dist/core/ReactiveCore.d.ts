import type { ReactiveNode } from '../nodes/ReactiveNode.js';
import type { IoElement } from '../elements/IoElement.js';
export type ReactiveOwner = ReactiveNode | IoElement;
export declare function isReactiveOwner(value: unknown): value is ReactiveOwner;
export declare const isIoValue: typeof isReactiveOwner;
export declare function initReactiveOwnerInternals(owner: ReactiveOwner): void;
export declare function addParent(child: ReactiveOwner, parent: ReactiveOwner): void;
export declare function removeParent(child: ReactiveOwner, parent: ReactiveOwner): void;
export declare function detachChildParents(owner: ReactiveOwner): void;
//# sourceMappingURL=ReactiveCore.d.ts.map
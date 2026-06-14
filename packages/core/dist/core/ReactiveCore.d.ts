import type { ReactiveNode } from '../nodes/ReactiveNode.js';
import type { IoElement } from '../elements/IoElement.js';
import { ChangeQueue } from './ChangeQueue.js';
import { EventDispatcher } from './EventDispatcher.js';
import { ProtoChain } from './ProtoChain.js';
import { Binding } from './Binding.js';
import { ReactivePropertyInstance } from './ReactiveProperty.js';
export type ReactiveOwner = ReactiveNode | IoElement;
export declare function isReactiveOwner(value: unknown): value is ReactiveOwner;
export declare const isIoValue: typeof isReactiveOwner;
export declare function initReactiveOwnerInternals(owner: ReactiveOwner): void;
export type DisposableInternals = {
    _bindings?: Map<string, Binding<unknown>>;
    _changeQueue?: ChangeQueue;
    _protochain?: ProtoChain;
    _eventDispatcher?: EventDispatcher;
    _reactiveProperties?: Map<string, ReactivePropertyInstance>;
    _parents?: Array<ReactiveNode | IoElement>;
    _children?: Array<ReactiveNode | IoElement>;
};
export declare function addParent(child: ReactiveOwner, parent: ReactiveOwner): void;
export declare function removeParent(child: ReactiveOwner, parent: ReactiveOwner): void;
export declare function detachChildParents(owner: ReactiveOwner): void;
//# sourceMappingURL=ReactiveCore.d.ts.map
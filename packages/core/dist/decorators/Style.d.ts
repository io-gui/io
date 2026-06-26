import { AnyConstructor } from '../nodes/ReactiveObject.js';
export declare const styleDecorators: WeakMap<AnyConstructor, string>;
export declare function Style(style: string): (target: AnyConstructor) => void;

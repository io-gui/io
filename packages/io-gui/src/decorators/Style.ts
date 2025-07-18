import { IoElement } from '../elements/IoElement.js';
import { Node, AnyConstructor } from '../nodes/Node.js';

export const styleDecorators: WeakMap<AnyConstructor, string> = new WeakMap();

// TODO: Figure out Style decorator
// TODO: doc
// TODO: test
// TODO: consider changing to constructor decorator
export function Style(style: string) {
  return (target: Node | IoElement, temp: string) => {
    console.log('***',temp);
    const constructor = target.constructor as AnyConstructor;
    styleDecorators.set(constructor, style);
  };
};
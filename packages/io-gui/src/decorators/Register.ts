import { Node } from '../nodes/Node';

/**
 * Register function to be called once per class.
 * @param {Node} ioNodeConstructor - Node class to register.
 */
export function Register(ioNodeConstructor: typeof Node) {
  ioNodeConstructor.prototype.Register(ioNodeConstructor);
}
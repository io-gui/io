import { IoNode } from '../node';

/**
 * Register function to be called once per class.
 * @param {IoNode} ioNodeConstructor - Node class to register.
 */
export function Register(ioNodeConstructor: typeof IoNode) {
  ioNodeConstructor.prototype.Register(ioNodeConstructor);
}
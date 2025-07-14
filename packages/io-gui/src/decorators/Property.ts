import { ReactivePropertyDefinition, ReactivePropertyDefinitionLoose } from '../core/ReactiveProperty.js';
import { Node, AnyConstructor, ReactivePropertyDefinitions } from '../nodes/Node.js';
import { IoElement } from '../elements/IoElement.js';


export const propertyDecorators: WeakMap<AnyConstructor, Record<string, any>> = new WeakMap();
export const reactivePropertyDecorators: WeakMap<AnyConstructor, ReactivePropertyDefinitions> = new WeakMap();

/**
 * Declares a property and an initial value for a property.
 * @decorator
 * @param {any} initialValue - Initial value.
 * @returns {Function} Property decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends Node {
 *   \@Property('default text')
 *   declare title: string;
 * }
 */
export function Property(initialValue: any = undefined) {
  return (target: Node | IoElement, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const properties = propertyDecorators.get(constructor) || {};
    propertyDecorators.set(constructor, properties);
    properties[propertyName] = initialValue;
  };
};

/**
 * Declares a reactive property and defines its inital value and behavior using a loose or strict definition.
 * @decorator
 * @param {ReactivePropertyDefinitionLoose} defLoose - Property definition.
 * @returns {Function} Property decorator function.
 *
 * @example
 * \@Register
 * class MyClass extends Node {
 *   \@ReactiveProperty({type: String, value: 'default text', reflect: true})
 *   declare title: string;
 * }
 *
 * @example
 * \@Register
 * class MyClass extends Node {
 *   \@ReactiveProperty({type: Array, init: [0, 0]})
 *   declare size: [number, number];
 * }
 */
export function ReactiveProperty(defLoose: ReactivePropertyDefinitionLoose = {}) {
  return (target: Node | IoElement, propertyName: string) => {
    const constructor = target.constructor as AnyConstructor;
    const properties = reactivePropertyDecorators.get(constructor) || {};

     // TODO: Move all property definition validation here!
     if (defLoose && typeof defLoose === 'object') {
      const def = defLoose as ReactivePropertyDefinition;
      if (def.type && def.type.name === 'NodeArray' && !(def.init instanceof Array && def.init.length === 1 && def.init[0] === 'this')) {
        console.error(`NodeArray property should be initialized with ["this"]: ${constructor.name}.${propertyName}`);
      }
    }

    reactivePropertyDecorators.set(constructor, properties);
    properties[propertyName] = defLoose;
  };
};
import {IoNode} from '../io-node.js';
import {ProtoProperty, ProtoPropertyRecord} from './properties.js';
import {ProtoListenerArrayType, ProtoListenerRecord} from './eventDispatcher.js';

type Constructor<T extends HTMLElement | Array<any> | unknown> = new (...args: any[]) => T;

/**
 * Internal utility class that contains usefull information about inherited constructors, function names and properties,
 * as well as some utility functions. Inherited information is gathered automatically by prototype chain traversal
 * that terminates when it reaches `IoNode.__proto__`, `HTMLElement`, `Object` or `Array`.
 */
export class ProtoChain {
  /*
   * Automatically generated array of all constructors inherited from the prototype chain.
   */
  public readonly constructors: Array<Constructor<any>> = [];
  /*
   * Automatically generated array of all function names that start with "on" or "_" inherited from the prototype chain.
   */
  public readonly functions: Array<string> = [];
  /*
   * Automatically generated array of all properties defined as `static get Properties()` return objects in inherited classes.
   */
  public readonly properties: {
    [property: string]: ProtoProperty;
  } = {};
  /*
   * Automatically generated array of all listeners defined as `static get Listeners()` return objects in inherited classes.
   */
  public readonly listeners: {
    [listener: string]: ProtoListenerArrayType;
  } = {};
  /**
   * Creates an instance of `ProtoChain` and initializes the arrays of inherited contructors and function names and properties.
   * @param {Constructor} nodeConstructor - Prototype object.
   */
  constructor(nodeConstructor: Constructor<any>) {
    let proto = nodeConstructor.prototype;
    while (
      proto
      && nodeConstructor.name !== 'classConstructor'
      && nodeConstructor !== HTMLElement
      && nodeConstructor !== Object
      && nodeConstructor !== Array) {
        // Add constructor
        this.constructors.push(nodeConstructor);
        // Add function names
        const fnames = Object.getOwnPropertyNames(proto);
        for (let j = 0; j < fnames.length; j++) {
          const fname = fnames[j] as string;
          if (fname === 'constructor') continue;
          const p = Object.getOwnPropertyDescriptor(proto, fname);
          if (p === undefined || p.get || p.set) continue;
          if (typeof proto[fname] === 'function') {
            if (this.functions.indexOf(fname) === -1 && (fname.startsWith('_') || fname.startsWith('on'))) {
              this.functions.push(fname);
            }
          }
        }
        // Continue prototype traversal
        proto = proto.__proto__;
        nodeConstructor = proto.constructor;
    }

    // Properties and listeners are assigned in reverse
    // TODO: change assignment direction and add to loop above for optimizatrion.
    for (let i = this.constructors.length; i--;) {
        // Add properties
        const props = (this.constructors[i] as any).Properties as ProtoPropertyRecord;
        for (const p in props) {
          if (!this.properties[p]) this.properties[p] = new ProtoProperty(props[p]);
          else this.properties[p].assign(props[p]);
          // TODO: Document or reconsider.
          if (p.charAt(0) === '_') {
            this.properties[p].notify = false;
            this.properties[p].enumerable = false;
          }
        }
        // Add listeners
        const listeners = (this.constructors[i] as any).Listeners as ProtoListenerRecord;
        for (const l in listeners) {
          const listener = (listeners[l] instanceof Array) ? listeners[l] :[listeners[l]];
          this.listeners[l] = listener as ProtoListenerArrayType;
        }
    }
  }
  /**
   * Binds all functions from the `.functions` list to specified instance.
   * @param {IoNode} node - `IoNode` instance to bind functions to.
   */
  bindFunctions(node: IoNode) {
    for (let i = this.functions.length; i--;) Object.defineProperty(node, this.functions[i], {value: node[this.functions[i]].bind(node)});
  }
}

import {Binding} from "./instance-bindings.js";

export class InstanceProperties {
  constructor(props, element) {
    Object.defineProperty(this, 'element', { value: element });
    this.set(props);
  }
  set(props) {
    for (let p in props) {
      if (this.element.__properties[p] == undefined) continue;
      if (props[p] instanceof Binding) {
        // TODO: decouple bindings from props
      } else {
        this.element.__properties[p].value = props[p];
      }
    }
  }
  update(props) {
    let observers = [];
    let reflections = [];
    let element = this.element;

    for (let prop in props) {

      if (props[prop] !== element[prop]) {

        if (prop === 'style' || prop === 'listeners' || prop === 'class') continue;

        let value = props[prop];

        // avoid triggering observers prematurely when re-rendering elements with different props.
        if (element.__properties && element.__properties.hasOwnProperty(prop)) {

          // TODO: remove  garbage / lingering bindings
          if (value instanceof Binding) {
            value = value.source[value.sourceProp];
          }

          let oldValue = element.__properties[prop].value;
          element.__properties[prop].value = value;

          // TODO: make less ugly
          if (element.__properties[prop].reflect && reflections.indexOf(prop) === -1) {
            reflections.push(prop);
          }

          if (element.__properties[prop].observer && observers.indexOf(element.__properties[prop].observer) === -1) {
            if (value !== oldValue) {
              observers.push(element.__properties[prop].observer);
            }
          }

        }
      }
    }

    // triggering observers
    for (let j = 0; j < observers.length; j++) {
      element[observers[j]]();
    }
    // triggering reflections
    for (let j = 0; j < reflections.length; j++) {
      element.reflectAttribute(reflections[j]);
    }
  }
}

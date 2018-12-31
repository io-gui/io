import {IoNode} from "./node.js";
import {Binding} from "./util/binding.js";

const nodes = {};

class StoreNode extends IoNode {
  static get properties() {
    return {
      key: String,
      value: undefined,
    };
  }
  constructor(props) {
    super(props);
    const value = localStorage.getItem(this.key);
    if (value !== null) {
      this.value = JSON.parse(value);
    }
  }
  valueChanged() {
    localStorage.setItem(this.key, this.value);
  }
}

StoreNode.Register();

export function storage(key, value) {
  let store = nodes[key];
  if (!store) {
    store = new StoreNode({key: key});
    nodes[key] = store;
    store.connect();
    store.binding = store.bind('value');
  }
  if (store.value === undefined && value !== undefined) {
    store.value = value;
  }
  return store.binding;
}

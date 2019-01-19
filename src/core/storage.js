import {IoNode} from "./node.js";

const nodes = {};

class IoStorageNode extends IoNode {
  static get properties() {
    return {
      key: String,
      value: undefined,
    };
  }
  constructor(props, defValue) {
    super(props);
    const value = localStorage.getItem(this.key);
    if (value !== null) {
      this.value = JSON.parse(value);
    } else {
      this.value = defValue;
    }
  }
  valueChanged() {
    localStorage.setItem(this.key, JSON.stringify(this.value));
  }
}

IoStorageNode.Register();

export function IoStorage(key, defValue) {
  if (!nodes[key]) {
    nodes[key] = new IoStorageNode({key: key}, defValue);
    nodes[key].connect();
    nodes[key].binding = nodes[key].bind('value');
  }
  return nodes[key].binding;
}

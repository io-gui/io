import {RegisterIoNode} from '../../build/iogui.js';

class DictionaryItem extends IoNode {
  static get Properties() {
    return {
      key: null,
      value: null,
      valueStore: Object,
    };
  }
  constructor(props) {
    super(props);
    this.value = this.valueStore[this.key];
  }
  keyChanged() {
    this.value = this.valueStore[this.key];
  }
}

RegisterIoNode(DictionaryItem);

class Dictionary extends IoNode {
  static get Properties() {
    return {
      valueStore: Object,
    };
  }
  registerValues(valueStore) {
    Object.assign(this.valueStore, valueStore);
  }
  bind(binding) {
    const item = new DictionaryItem({
      key: binding,
      valueStore: this.valueStore,
    });
    item.connect(this);
    return item.bind('value');
  }
}

RegisterIoNode(Dictionary);
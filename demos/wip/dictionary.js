import {Node} from '../../build.io.js';

class DictionaryItem extends Node {
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
DictionaryItem.Register();

class Dictionary extends Node {
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
Dictionary.Register();
import {Node} from '../../../srcj/core/node.js';

// TODO: test different value types

class EmulatedLocalStorage {
  get permited() {
    try {
      return self.localStorage.getItem('io-storage-user-permitted');
    } catch (error) {
      console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
    }
    return undefined;
  }
  set permited(value) {
    try {
      self.localStorage.setItem('io-storage-user-permitted', value);
      const permited = self.localStorage.getItem('io-storage-user-permitted');
      if (permited === 'true') {
        for (let i in this.store) {
          self.localStorage.setItem(i, this.store[i]);
          delete this.store[i];
        }
        console.log('IoStorage: Saved localStorage state.');
      }
    } catch (error) {
      console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
    }
  }
  constructor() {
    Object.defineProperty(this, 'store', {value: {}, writable: true});
    Object.defineProperty(this, 'warned', {value: false, writable: true});
  }
  setItem(key, value) {
    if (this.permited === 'true') {
      self.localStorage.setItem(key, value);
    } else {
      this.store[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
      if (!this.warned) {
        if (this.permited === 'false') {
          console.warn('IoStorage: localStorage permission denied by user.');
        } else {
          console.warn('IoStorage: localStorage pending permission by user.');
        }
        this.warned = true;
      }
      if (key === 'io-storage-user-permitted') {
        this.permited = this.store[key];
      }
    }
  }
  getItem(key) {
    if (this.permited === 'true') {
      return self.localStorage.getItem(key);
    } else {
      return this.store[key];
    }
  }
  removeItem(key) {
    if (this.permited === 'true') {
      return self.localStorage.removeItem(key);
    } else {
      delete this.store[key];
    }
  }
  clear() {
    if (this.permited === 'true') {
      return self.localStorage.clear();
    } else {
      this.store = {};
    }
  }
}

const localStorage = new EmulatedLocalStorage();

const nodes = {};
let hashes = {};

const parseHashes = function() {
  return self.location.hash.substr(1).split('&').reduce(function (result, item) {
    const parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});
};

const getHashes = function() {
  hashes = parseHashes();
  for (let hash in hashes) {
    if (nodes[hash]) {
      if (nodes[hash] !== '') {
        const hashValue = hashes[hash].replace(/%20/g, ' ');
        if (!isNaN(hashValue)) {
          nodes[hash].value = JSON.parse(hashValue);
        } else if (hashValue === 'true' || hashValue === 'false') {
          nodes[hash].value = JSON.parse(hashValue);
        } else {
          nodes[hash].value = hashValue;
        }
      }
    }
  }
  for (let node in nodes) {
    if (nodes[node].storage === 'hash' && !hashes[node]) {
      nodes[node].value = nodes[node].default;
    }
  }
};

const setHashes = function(force) {
  let hashString = '';
  for (let node in nodes) {
    if ((nodes[node].storage === 'hash' || force) && nodes[node].value !== undefined && nodes[node].value !== '' && nodes[node].value !== nodes[node].default) {
      if (typeof nodes[node].value === 'string') {
        hashString += node + '=' + nodes[node].value + '&';
      } else {
        hashString += node + '=' + JSON.stringify(nodes[node].value) + '&';
      }
    }
  }
  for (let hash in hashes) {
    if (hash && !nodes[hash]) {
      hashString += hash + '=' + hashes[hash] + '&';
    }
  }
  hashString = hashString.slice(0, -1);
  self.location.hash = hashString;
  if (!self.location.hash) history.replaceState({}, document.title, self.location.pathname + self.location.search);
};

self.addEventListener('hashchange', getHashes, false);
getHashes();

class IoStorage extends Node {
  static get Properties() {
    return {
      key: String,
      value: undefined,
      default: undefined,
      storage: undefined,
    };
  }
  constructor(props) {
    super(Object.assign({default: props.value}, props));
    if (props.key) nodes[props.key] = nodes[props.key] || this;
    this.binding = this.bind('value');
    this.getStorageValue();
    this.connect(window);
  }
  getStorageValue() {
    switch (this.storage) {
      case 'hash': {
        if (hashes[this.key] !== undefined) {
          const hashValue = hashes[this.key].replace(/%20/g, ' ');
          try {
            this.value = JSON.parse(hashValue);
          } catch (e) {
            this.value = hashValue;
          }
        } else {
          this.value = this.default;
        }
        break;
      }
      case 'local': {
        const key = self.location.pathname !== '/' ? self.location.pathname + this.key : this.key;
        const localValue = localStorage.getItem(key);
        if (localValue !== null && localValue !== undefined) {
          this.value = JSON.parse(localValue);
        } else {
          this.value = this.default;
        }
        break;
      }
      default: {
        this.value = this.default;
      }
    }
  }
  valueChanged() {
    switch (this.storage) {
      case 'hash': {
        setHashes();
        break;
      }
      case 'local': {
        const key = self.location.pathname !== '/' ? self.location.pathname + this.key : this.key;
        if (this.value === null || this.value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(this.value));
        }
        break;
      }
    }
  }
}

IoStorage.Register();

const IoStorageFactory = function(props) {
  if (props && typeof props === 'string') {
    props = {key: props};
  }
  if (props && props.key && nodes[props.key]) {
    if (props.storage) nodes[props.key].storage = props.storage;
    if (props.value !== undefined) nodes[props.key].default = props.value;
    return nodes[props.key].binding;
  }
  return new IoStorage(props).binding;
};

Object.defineProperty(IoStorageFactory, 'permitted', {
  get: () => {
    return localStorage.permited;
  },
  set: (value) => {
    localStorage.permited = value;
  }
});

export {IoStorageFactory};

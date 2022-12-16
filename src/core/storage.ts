import { Binding } from '../iogui.js';
import { Property } from './internals/property.js';
import { IoNode, RegisterIoNode } from './node.js';

class EmulatedLocalStorage {
  declare store: Map<string, unknown>;
  declare warned: boolean;
  declare permitted: boolean;
  constructor() {
    Object.defineProperty(this, 'store', {value: new Map()});
    Object.defineProperty(this, 'warned', {value: false, writable: true});
  }
  get permited() {
    try {
      return self.localStorage.getItem('IoStorage:user-permitted') === 'true';
    } catch (error) {
      console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
    }
    return false;
  }
  set permited(value: boolean) {
    try {
      self.localStorage.setItem('IoStorage:user-permitted', String(value));
      if (this.permited) {
        this.store.forEach((value: unknown, key: string) => {
          self.localStorage.setItem(key, String(value));
          this.store.delete(key);
        });
        console.log('IoStorage: localStorage permission saved.');
      }
    } catch (error) {
      console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
    }
  }
  setItem(key: string, value: unknown) {
    const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    if (key === 'IoStorage:user-permitted') {
      this.permited = value === 'true';
      return;
    }
    if (this.permited) {
      self.localStorage.setItem(key, strValue);
    } else {
      this.store.set(key, strValue);
      if (!this.warned && !this.permited) {
        console.warn('IoStorage: localStorage permission not set.');
        this.warned = true;
      }
    }
  }
  getItem(key: string): string | null {
    if (this.permited) {
      return self.localStorage.getItem(key);
    } else if (this.store.has(key)) {
      return this.store.get(key) as string;
    }
    return null;
  }
  removeItem(key: string) {
    if (this.permited) {
      return self.localStorage.removeItem(key);
    } else {
      this.store.delete(key);
    }
  }
  clear() {
    if (this.permited) {
      return self.localStorage.clear();
    } else {
      this.store.clear();
    }
  }
}

const localStorage = new EmulatedLocalStorage();

type StorageNodes = {
  local: Map<string, IoStorageNode>,
  hash: Map<string, IoStorageNode>,
  none: Map<string, IoStorageNode>
}

const nodes: StorageNodes = {
  local: new Map(),
  hash: new Map(),
  none: new Map(),
};

let hashValues: Record<string, any> = {};

interface StorageProps {
  key: string,
  value?: any,
  default?: any,
  storage?: 'hash' | 'local' | 'none',
}

export function genObjectStorageID(object: Record<string, any>) {
  const string = JSON.stringify(object);
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = Math.imul(31, hash) + string.charCodeAt(i) | 0;
  }
  return 'io-local-state-' + String(hash);
}

@RegisterIoNode
export class IoStorageNode extends IoNode {

  @Property({value: ''})
  declare key: string;

  @Property({value: undefined})
  declare value: any;

  @Property({value: undefined})
  declare default: any;

  @Property({value: 'none'})
  declare storage: 'hash' | 'local' | 'none';

  declare binding: Binding;

  constructor(props: StorageProps) {
    debug: {
      if (typeof props !== 'object') {
        console.warn('Ivalid IoStorage arguments!');
      } else {
        if (typeof props.key !== 'string' || !props.key)
          console.warn('Ivalid IoStorage key!');
        if (props.storage && ['hash', 'local', 'none'].indexOf(props.storage) === -1)
          console.warn('Ivalid IoStorage storage!');
      }
    }
    const s = (props.storage || 'none') as keyof StorageNodes;
    if (nodes[s].has(props.key)) {
      return nodes[s].get(props.key) as IoStorageNode;
    } else {
      const def = props.default || props.value;
      switch (props.storage) {
        case 'hash': {
          const hash = IoStorage.getValueFromHash(props.key);
          if (hash !== undefined) {
            try {
              props.value = JSON.parse(hash);
            } catch (e) {
              props.value = hash;
            }
          }
          break;
        }
        case 'local': {
          const localValue = localStorage.getItem('IoStorage:' + props.key);
          if (localValue) {
            props.value = JSON.parse(localValue);
          }
          break;
        }
      }
      if (props.value === undefined) {
        props.value = def;
      }
      super(Object.assign({default: def}, props));
      if (props.key !== '__proto__') {
        nodes[s].set(props.key, this);
      }

      this.binding = this.bind('value');
      this.binding.dispose = () => {
        this._clearStorage();
      };
      return this;
    }
  }
  dispose() {
    this._clearStorage();
    super.dispose();
  }
  _clearStorage() {
    switch (this.storage) {
      case 'hash': {
        this.removeValueToHash();
        break;
      }
      case 'local': {
        localStorage.removeItem('IoStorage:' + this.key);
        break;
      }
    }
    const s = (this.storage) as keyof StorageNodes;
    nodes[s].delete(this.key);
  }
  valueChanged() {
    switch (this.storage) {
      case 'hash': {
        this.saveValueToHash();
        break;
      }
      case 'local': {
        if (this.value === null || this.value === undefined) {
          localStorage.removeItem('IoStorage:' + this.key);
        } else {
          localStorage.setItem('IoStorage:' + this.key, JSON.stringify(this.value));
        }
        break;
      }
    }
  }
  removeValueToHash() {
    hashValues = IoStorage.parseHash(self.location.hash);
    delete hashValues[this.key];

    let hashString = '';
    for (const h in hashValues) {
      hashString += h + '=' + hashValues[h] + '&';
    }
    if (hashString) {
      hashString = hashString.slice(0, -1);
      self.location.hash = hashString;
    } else {
      history.replaceState('', document.title, self.location.pathname + self.location.search);
    }
  }
  saveValueToHash() {
    hashValues = IoStorage.parseHash(self.location.hash);

    const value = this.value;
    if (value !== undefined && value !== '' && value !== this.default) {
      if (typeof value === 'string') {
        if (isNaN(value as any)) {
          hashValues[this.key] = value;
        } else {
          hashValues[this.key] = '"' + value + '"';
        }
      } else {
        hashValues[this.key] = JSON.stringify(value);
      }
    } else {
      delete hashValues[this.key];
    }

    let hashString = '';
    for (const h in hashValues) {
      hashString += h + '=' + hashValues[h] + '&';
    }
    if (hashString) {
      hashString = hashString.slice(0, -1);
      self.location.hash = hashString;
    } else {
      history.replaceState('', document.title, self.location.pathname + self.location.search);
    }
  }
}

export const IoStorage = function(props: StorageProps) {
  const storageNode = new IoStorageNode(props);
  return storageNode.binding;
};

Object.defineProperty(IoStorage, 'permitted', {
  get: () => {
    return localStorage.permited;
  },
  set: (value) => {
    localStorage.permited = value;
  }
});

// TODO: unhack and test
IoStorage.parseHash = function(hash: string) {
  return hash.substring(1).split('&').reduce(function (result: Record<string, string>, item) {
    const parts = item.split('=');
    if (parts[0] && parts[1]) {
      result[parts[0]] = parts[1].replace(/%22/g, '"').replace(/%20/g, ' ');
    }
    return result;
  }, {});
};

IoStorage.getValueFromHash = function(key: string) {
  hashValues = IoStorage.parseHash(self.location.hash);
  if (hashValues[key]) {
    try {
      return JSON.parse(hashValues[key]);
    } catch (e) {
      return hashValues[key];
    }
  }
};

IoStorage.updateAllFromHash = function() {
  hashValues = IoStorage.parseHash(self.location.hash);
  for (const h in hashValues) {
    if (nodes.hash.has(h)) {
      const node = nodes.hash.get(h) as IoStorageNode;
      try {
        node.value = JSON.parse(hashValues[h]);
      } catch (e) {
        node.value = hashValues[h];
      }
    }
  }
};

self.addEventListener('hashchange', IoStorage.updateAllFromHash, false);
IoStorage.updateAllFromHash();

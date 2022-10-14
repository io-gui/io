import { Binding } from '../iogui.js';
import { IoProperty } from './internals/property.js';
import { IoNode, RegisterIoNode } from './node.js';

// class EmulatedLocalStorage {
//   store: Record<string, unknown> = {};
//   warned = false;
//   get permited() {
//     try {
//       return !!self.localStorage.getItem('io-storage-user-permitted');
//     } catch (error) {
//       console.warn('IoStorageNode: Cannot access localStorage. Check browser privacy settings!');
//     }
//     return false;
//   }
//   set permited(value: boolean) {
//     try {
//       self.localStorage.setItem('io-storage-user-permitted', String(value));
//       const permited = self.localStorage.getItem('io-storage-user-permitted');
//       if (permited === 'true') {
//         for (const i in this.store) {
//           self.localStorage.setItem(i, String(this.store[i]));
//           delete this.store[i];
//         }
//         console.log('IoStorageNode: Saved localStorage state.');
//       }
//     } catch (error) {
//       console.warn('IoStorageNode: Cannot access localStorage. Check browser privacy settings!');
//     }
//   }
//   constructor() {
//     Object.defineProperty(this, 'store', {value: {}, writable: true});
//     Object.defineProperty(this, 'warned', {value: false, writable: true});
//   }
//   setItem(key: string, value: unknown) {
//     const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
//     if (this.permited) {
//       self.localStorage.setItem(key, strValue);
//     } else {
//       this.store[key] = strValue;
//       if (!this.warned) {
//         if (!this.permited) {
//           console.warn('IoStorageNode: localStorage permission denied by user.');
//         } else {
//           console.warn('IoStorageNode: localStorage pending permission by user.');
//         }
//         this.warned = true;
//       }
//       if (key === 'io-storage-user-permitted') {
//         this.permited = !!this.store[key];
//       }
//     }
//   }
//   getItem(key: string) {
//     if (this.permited) {
//       return self.localStorage.getItem(key);
//     } else {
//       return this.store[key];
//     }
//   }
//   removeItem(key: string) {
//     if (this.permited) {
//       return self.localStorage.removeItem(key);
//     } else {
//       delete this.store[key];
//     }
//   }
//   clear() {
//     if (this.permited) {
//       return self.localStorage.clear();
//     } else {
//       this.store = {};
//     }
//   }
// }
// const localStorage = new EmulatedLocalStorage();

type StorageNodes = {
  local: Record<string, IoStorageNode>,
  hash: Record<string, IoStorageNode>,
  none: Record<string, IoStorageNode>
}

const nodes: StorageNodes = {
  local: {},
  hash: {},
  none: {},
};

let hashValues: Record<string, any> = {};

interface StorageProps {
  key: string,
  value?: any,
  default?: any,
  storage?: 'hash' | 'local' | 'none',
}

@RegisterIoNode
export class IoStorageNode extends IoNode {

  @IoProperty({value: ''})
  declare key: string;

  @IoProperty({value: undefined})
  declare value: any;

  @IoProperty({value: undefined})
  declare default: any;

  @IoProperty({value: 'none'})
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
    if (nodes[s][props.key]) {
      return nodes[s][props.key];
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
          const localValue = localStorage.getItem('io-storage:' + props.key);
          if (localValue !== null) {
            props.value = JSON.parse(localValue);
          }
          break;
        }
      }
      if (props.value === undefined) {
        props.value = def;
      }
      super(Object.assign({default: def}, props));
      nodes[s][props.key] = this;

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
        localStorage.removeItem('io-storage:' + this.key);
        break;
      }
    }
    delete nodes[this.storage][this.key];
  }
  valueChanged() {
    switch (this.storage) {
      case 'hash': {
        this.saveValueToHash();
        break;
      }
      case 'local': {
        if (this.value === null || this.value === undefined) {
          localStorage.removeItem('io-storage:' + this.key);
        } else {
          localStorage.setItem('io-storage:' + this.key, JSON.stringify(this.value));
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
}

IoStorage.updateAllFromHash = function() {
  hashValues = IoStorage.parseHash(self.location.hash);
  for (const h in hashValues) {
    if (nodes.hash[h]) {
      try {
        nodes.hash[h].value = JSON.parse(hashValues[h]);
      } catch (e) {
        nodes.hash[h].value = hashValues[h];
      }
    }
  }
};

self.addEventListener('hashchange', IoStorage.updateAllFromHash, false);
IoStorage.updateAllFromHash();

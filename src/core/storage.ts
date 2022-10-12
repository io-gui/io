import { IoProperty } from './internals/property.js';
import { IoNode, RegisterIoNode } from './node.js';

// class EmulatedLocalStorage {
//   store: Record<string, unknown> = {};
//   warned = false;
//   get permited() {
//     try {
//       return !!self.localStorage.getItem('io-storage-user-permitted');
//     } catch (error) {
//       console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
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
//         console.log('IoStorage: Saved localStorage state.');
//       }
//     } catch (error) {
//       console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
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
//           console.warn('IoStorage: localStorage permission denied by user.');
//         } else {
//           console.warn('IoStorage: localStorage pending permission by user.');
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

const nodes: Record<string, IoStorage> = {};

let hashes: Record<string, any> = {};

// TODO: unhack and test
const parseHashes = function() {
  return self.location.hash.substr(1).split('&').reduce(function (result: Record<string, string>, item) {
    const parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});
};

export const getStorageHashes = function() {
  hashes = parseHashes();
  for (const hash in hashes) {
    // TODO: clean up types
    const h = hash;
    const n = 'hash:' + h;
    if (nodes[n]) {
      if (hashes[h] !== '') {
        const hashValue = (hashes[h] as string).replace(/%20/g, ' ');
        if (!isNaN(hashValue as unknown as number)) {
          nodes[n].value = JSON.parse(hashValue);
        } else if (hashValue === 'true' || hashValue === 'false') {
          nodes[n].value = JSON.parse(hashValue);
        } else {
          nodes[n].value = hashValue;
        }
      }
    }
  }
  for (const k in nodes) {
    if (nodes[k].storage === 'hash' && !hashes[k.replace('hash:', '')]) {
      nodes[k].value = nodes[k].default;
    }
  }
};

export const setStorageHashes = function(force = false) {
  let hashString = '';
  for (const n in nodes) {
    if ((nodes[n].storage === 'hash' || force === true) && nodes[n].value !== undefined && nodes[n].value !== '' && nodes[n].value !== nodes[n].default) {
      const h = n.replace('hash:', '');
      if (typeof nodes[n].value === 'string') {
        hashString += h + '=' + nodes[n].value + '&';
      } else {
        hashString += h + '=' + JSON.stringify(nodes[n].value) + '&';
      }
    }
  }
  for (const h in hashes) {
    const k = 'hash:' + h;
    if (h && !nodes[k]) {
      hashString += h + '=' + hashes[h] + '&';
    }
  }
  hashString = hashString.slice(0, -1);
  self.location.hash = hashString;
  if (!self.location.hash) {
    history.replaceState({}, document.title, self.location.pathname + self.location.search);
  }
};

self.addEventListener('hashchange', getStorageHashes, false);
getStorageHashes();

interface StorageProps {
  key: string,
  value?: unknown,
  storage?: 'hash' | 'local' | 'none',
}

@RegisterIoNode
export class IoStorage extends IoNode {

  @IoProperty({value: ''})
  declare key: string;

  @IoProperty({value: undefined})
  declare value: any;

  @IoProperty({value: undefined})
  declare default: any;

  @IoProperty({value: 'none'})
  declare storage: 'hash' | 'local' | 'none';

  constructor(props: StorageProps) {
    const k = props.storage + ':' + props.key;
    if (nodes[k]) {
      return nodes[k];
    } else {
      const def = props.value;
      switch (props.storage) {
        case 'hash': {
          if (hashes[props.key] !== undefined) {
            const hashValue = (hashes[props.key] as string).replace(/%20/g, ' ');
            try {
              props.value = JSON.parse(hashValue);
            } catch (e) {
              props.value = hashValue;
            }
          }
          break;
        }
        case 'local': {
          const key = 'io-storage:' + props.key;
          const localValue = localStorage.getItem(key);
          if (localValue !== null && localValue !== undefined) {
            props.value = JSON.parse(localValue as string);
          }
          break;
        }
      }
      super(Object.assign({default: def}, props));
      nodes[k] = this;
      return this;
    }
  }
  loadStorageValue() {
    const key = this.key as keyof typeof hashes;
    switch (this.storage) {
      case 'hash': {
        if (hashes[key] !== undefined) {
          const hashValue = (hashes[key] as string).replace(/%20/g, ' ');
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
        const key = 'io-storage:' + this.key;
        const localValue = localStorage.getItem(key);
        if (localValue !== null && localValue !== undefined) {
          this.value = JSON.parse(localValue as string);
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
        setStorageHashes();
        break;
      }
      case 'local': {
        const key = 'io-storage:' + this.key;
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

const IoStorageFactory = function(props: StorageProps) {
  if (typeof props === 'string') props = {key: props};
  return new IoStorage(props).bind('value');
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

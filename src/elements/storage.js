import {IoCore} from "../io-core.js";

const nodes = {};
let hashes = {};

const parseHashes = function() {
  return window.location.hash.substr(1).split('&').reduce(function (result, item) {
    const parts = item.split('=');
    result[parts[0]] = parts[1];
    return result;
  }, {});
};

const getHashes = function() {
  hashes = parseHashes();
  for (let hash in hashes) {
    if (nodes[hash] && nodes[hash].hash) {
      if (nodes[hash] !== '') {
        if (!isNaN(hashes[hash])) {
          nodes[hash].value = JSON.parse(hashes[hash]);
        } else if (hashes[hash] === 'true' || hashes[hash] === 'false') {
          nodes[hash].value = JSON.parse(hashes[hash]);
        } else {
          nodes[hash].value = hashes[hash];
        }
      }
    }
  }
};

const setHashes = function() {
  let hashString = '';
  for (let node in nodes) {
    if (nodes[node].hash && nodes[node].value !== undefined && nodes[node].value !== '') {
      if (typeof nodes[node].value === 'string') {
        hashString += node + '=' + nodes[node].value + '&';
      } else {
        hashString += node + '=' + JSON.stringify(nodes[node].value) + '&';
      }
    }
  }
  window.location.hash = hashString.slice(0, -1);
};

window.addEventListener("hashchange", getHashes, false);
getHashes();

class IoStorageNode extends IoCore {
  static get properties() {
    return {
      key: String,
      value: undefined,
      hash: Boolean,
    };
  }
  constructor(props, defValue) {
    super(props);
    const localValue = localStorage.getItem(this.key);
    const hashValue = hashes[this.key];
    if (this.hash && hashValue !== undefined) {
      this.value = hashValue;
    } else if (localValue !== null && localValue !== undefined) {
      this.value = JSON.parse(localValue);
    } else {
      this.value = defValue;
    }
  }
  valueChanged() {
    if (this.value === null || this.value === undefined) {
      localStorage.removeItem(this.key);
    } else {
      localStorage.setItem(this.key, JSON.stringify(this.value));
    }
    setHashes();
  }
}

IoStorageNode.Register();

export function IoStorage(key, defValue, hash) {
  if (!nodes[key]) {
    nodes[key] = new IoStorageNode({key: key, hash: hash}, defValue);
    nodes[key].binding = nodes[key].bind('value');
  }
  setHashes();
  return nodes[key].binding;
}

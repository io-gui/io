import {IoNode} from "./node.js";

const nodes = {};
let hashes = {};

// let permitted = !!localStorage.getItem('io-storage-permitted');

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
    if (nodes[hash]) {
      if (nodes[hash] !== '') {
        const hashValue = hashes[hash].replace(/%20/g, " ");
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
    if (nodes[node].persist === 'hash' && !hashes[node]) {
      nodes[node].value = nodes[node].default;
    }
  }
};

const setHashes = function(force) {
  let hashString = '';
  for (let node in nodes) {
    if ((nodes[node].persist === 'hash' || force) && nodes[node].value !== undefined && nodes[node].value !== '' && nodes[node].value !== nodes[node].default) {
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
  window.location.hash = hashString;
  if (!window.location.hash) history.replaceState({}, document.title, window.location.pathname + window.location.search);
};

window.addEventListener("hashchange", getHashes, false);
getHashes();

export class IoStorageNode extends IoNode {
  static get Properties() {
    return {
      key: String,
      value: undefined,
      default: undefined,
      persist: 'local',
    };
  }
  constructor(props) {
    super(props);
    this.default = this.value;
    this.value = undefined;
    this.binding = this.bind('value');
    this.connect(window);
    if (this.persist === 'hash') {
      if (hashes[this.key] !== undefined) {
        const hashValue = hashes[this.key].replace(/%20/g, " ");
        try {
          this.value = JSON.parse(hashValue);
        } catch (e) {
          this.value = hashValue;
        }
      } else {
        this.value = this.default;
      }
    } else if (this.persist === 'local') {
      const key = window.location.pathname !== '/' ? window.location.pathname + this.key : this.key;
      const localValue = localStorage.getItem(key);
      if (localValue !== null && localValue !== undefined) {
        this.value = JSON.parse(localValue);
      } else {
        this.value = this.default;
      }
    } else {
      this.value = this.default;
    }
  }
  valueChanged() {
    if (this.persist === 'hash') {
      setHashes();
    } else if (this.persist === 'local') {
      const key = window.location.pathname !== '/' ? window.location.pathname + this.key : this.key;
      if (this.value === null || this.value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(this.value));
      }
    }
  }
}

export function IoStorage(key, value, persist) {
  if (!nodes[key]) {
    nodes[key] = new IoStorageNode({key: key, persist: persist, value: value});
  }
  return nodes[key].binding;
}

IoStorageNode.Register();

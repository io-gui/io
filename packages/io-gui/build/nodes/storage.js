var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property } from '../core/decorators/property';
import { Register } from '../core/decorators/register';
import { IoNode } from '../core/node';
class EmulatedLocalStorage {
    constructor() {
        Object.defineProperty(this, 'store', { value: new Map() });
        Object.defineProperty(this, 'warned', { value: false, writable: true });
    }
    get permitted() {
        try {
            return self.localStorage.getItem('IoStorage:user-permitted') === 'true';
        }
        catch (error) {
            console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
        }
        return false;
    }
    set permitted(permitted) {
        try {
            if (permitted) {
                console.log('IoStorage: localStorage permission granted.');
                this.store.set('IoStorage:user-permitted', String(permitted));
                this.store.forEach((value, key) => {
                    self.localStorage.setItem(key, String(value));
                    this.store.delete(key);
                });
            }
            else {
                console.log('IoStorage: localStorage permission revoked.');
                self.localStorage.setItem('IoStorage:user-permitted', String(permitted));
                new Map(Object.entries(self.localStorage)).forEach((value, key) => {
                    this.store.set(key, value);
                });
                self.localStorage.clear();
            }
        }
        catch (error) {
            console.warn('IoStorage: Cannot access localStorage. Check browser privacy settings!');
        }
    }
    setItem(key, value) {
        const strValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (key === 'IoStorage:user-permitted') {
            this.permitted = value === 'true';
            return;
        }
        if (this.permitted) {
            self.localStorage.setItem(key, strValue);
        }
        else {
            this.store.set(key, strValue);
            if (!this.warned && !this.permitted) {
                console.warn('IoStorage: localStorage permission not set.');
                this.warned = true;
            }
        }
    }
    getItem(key) {
        if (this.permitted) {
            return self.localStorage.getItem(key);
        }
        else if (this.store.has(key)) {
            return this.store.get(key);
        }
        return null;
    }
    removeItem(key) {
        if (this.permitted) {
            return self.localStorage.removeItem(key);
        }
        else {
            this.store.delete(key);
        }
    }
    clear() {
        if (this.permitted) {
            return self.localStorage.clear();
        }
        else {
            this.store.clear();
        }
    }
}
const localStorage = new EmulatedLocalStorage();
const nodes = {
    local: new Map(),
    hash: new Map(),
    none: new Map(),
};
let hashValues = {};
export function genObjectStorageID(object) {
    const string = JSON.stringify(object);
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = Math.imul(31, hash) + string.charCodeAt(i) | 0;
    }
    return 'io-local-state-' + String(hash);
}
let IoStorageNode = class IoStorageNode extends IoNode {
    constructor(props) {
        debug: {
            if (typeof props !== 'object') {
                console.warn('Ivalid IoStorage arguments!');
            }
            else {
                if (typeof props.key !== 'string' || !props.key)
                    console.warn('Ivalid IoStorage key!');
                if (props.storage && ['hash', 'local', 'none'].indexOf(props.storage) === -1)
                    console.warn('Ivalid IoStorage storage!');
            }
        }
        const s = (props.storage || 'none');
        if (nodes[s].has(props.key)) {
            return nodes[s].get(props.key);
        }
        else {
            const def = props.default || props.value;
            switch (props.storage) {
                case 'hash': {
                    const hash = getValueFromHash(props.key);
                    if (hash !== undefined) {
                        try {
                            props.value = JSON.parse(hash);
                        }
                        catch (error) {
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
            super(Object.assign({ default: def }, props));
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
        const s = (this.storage);
        nodes[s].delete(this.key);
    }
    valueChanged() {
        switch (this.storage) {
            case 'hash': {
                this.saveValueToHash();
                break;
            }
            case 'local': {
                if (this.value === null || this.value === undefined || this.value === this.default) {
                    localStorage.removeItem('IoStorage:' + this.key);
                }
                else {
                    localStorage.setItem('IoStorage:' + this.key, JSON.stringify(this.value));
                }
                break;
            }
        }
    }
    removeValueToHash() {
        hashValues = parseHash(self.location.hash);
        delete hashValues[this.key];
        let hashString = '';
        for (const h in hashValues) {
            hashString += h + '=' + hashValues[h] + '&';
        }
        if (hashString) {
            hashString = hashString.slice(0, -1);
            self.location.hash = hashString;
        }
        else {
            history.replaceState('', document.title, self.location.pathname + self.location.search);
        }
    }
    saveValueToHash() {
        hashValues = parseHash(self.location.hash);
        const value = this.value;
        if (value !== undefined && value !== '' && value !== this.default) {
            if (typeof value === 'string') {
                if (isNaN(value)) {
                    hashValues[this.key] = value;
                }
                else {
                    hashValues[this.key] = '"' + value + '"';
                }
            }
            else {
                hashValues[this.key] = JSON.stringify(value);
            }
        }
        else {
            delete hashValues[this.key];
        }
        let hashString = '';
        for (const h in hashValues) {
            hashString += h + '=' + hashValues[h] + '&';
        }
        if (hashString) {
            hashString = hashString.slice(0, -1);
            self.location.hash = hashString;
        }
        else {
            history.replaceState('', document.title, self.location.pathname + self.location.search);
        }
    }
};
__decorate([
    Property({ value: '', type: String })
], IoStorageNode.prototype, "key", void 0);
__decorate([
    Property({ value: undefined })
], IoStorageNode.prototype, "value", void 0);
__decorate([
    Property({ value: undefined })
], IoStorageNode.prototype, "default", void 0);
__decorate([
    Property({ value: 'none', type: String })
], IoStorageNode.prototype, "storage", void 0);
IoStorageNode = __decorate([
    Register
], IoStorageNode);
export { IoStorageNode };
export const IoStorage = Object.assign((props) => {
    const storageNode = new IoStorageNode(props);
    return storageNode.binding;
}, {
    permit() {
        localStorage.permitted = true;
    },
    unpermit() {
        localStorage.permitted = false;
    }
});
// TODO: unhack and test
function parseHash(hash) {
    return hash.substring(1).split('&').reduce(function (result, item) {
        const parts = item.split('=');
        if (parts[0] && parts[1]) {
            result[parts[0]] = parts[1].replace(/%22/g, '"').replace(/%20/g, ' ');
        }
        return result;
    }, {});
}
function getValueFromHash(key) {
    hashValues = parseHash(self.location.hash);
    if (hashValues[key]) {
        try {
            return JSON.parse(hashValues[key]);
        }
        catch (error) {
            return hashValues[key];
        }
    }
}
function updateAllFromHash() {
    hashValues = parseHash(self.location.hash);
    for (const h in hashValues) {
        if (nodes.hash.has(h)) {
            const node = nodes.hash.get(h);
            try {
                node.value = JSON.parse(hashValues[h]);
            }
            catch (error) {
                node.value = hashValues[h];
            }
        }
    }
}
self.addEventListener('hashchange', updateAllFromHash, false);
updateAllFromHash();
//# sourceMappingURL=storage.js.map
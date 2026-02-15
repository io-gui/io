var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Pads_1;
import { Pad } from './items/pad.js';
import { Register, ReactiveNode } from '@io-gui/core';
import { DataTexture, NearestFilter, RGBAFormat, UnsignedByteType } from 'three';
let Pads = Pads_1 = class Pads extends ReactiveNode {
    _width = 0;
    _height = 0;
    _stride = 0;
    _cells = [];
    _texture;
    get texture() {
        return this._texture;
    }
    constructor(width = 2, height = 2, data = {}) {
        super();
        this.clear(width, height);
        this.load(data);
        this._texture = this._createTexture(new Uint8Array(width * height * 4), width, height);
    }
    _createTexture(data, width, height) {
        const texture = new DataTexture(data, width, height, RGBAFormat, UnsignedByteType);
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        texture.generateMipmaps = false;
        texture.needsUpdate = true;
        return texture;
    }
    updateTexture(width, height) {
        let data = this._texture.image.data;
        const textureSize = width * height * 4;
        if (this._texture.image.data.length !== textureSize) {
            this._texture.dispose();
            this._texture = this._createTexture(new Uint8Array(textureSize), width, height);
        }
        data = this._texture.image.data;
        data.fill(0);
        this.forEach((pad, x, y) => {
            if (x < 0 || x >= width || y < 0 || y >= height)
                return;
            const color = pad.renderColor;
            const index = (x + y * width) * 4;
            data[index] = Math.max(0, Math.min(255, Math.round(color.r * 255)));
            data[index + 1] = Math.max(0, Math.min(255, Math.round(color.g * 255)));
            data[index + 2] = Math.max(0, Math.min(255, Math.round(color.b * 255)));
            data[index + 3] = pad.isTerminal ? 255 : 0;
        });
        this._texture.needsUpdate = true;
    }
    clear(width, height) {
        this._width = width;
        this._height = height;
        this._stride = width;
        this._cells = new Array(width * height);
        this.dispatch('game-update', undefined, true);
    }
    load(data = {}) {
        for (const key in data) {
            const index = Number.parseInt(key, 10);
            if (!Number.isFinite(index)) {
                debug: console.error('Invalid pad index key', key);
                continue;
            }
            const y = Math.floor(index / this._stride);
            const x = index - y * this._stride;
            const item = data[key];
            this.addAt(x, y, item.color);
        }
        this.dispatch('game-update', undefined, true);
    }
    forEach(callback) {
        for (let y = 0; y < this._height; y++) {
            for (let x = 0; x < this._width; x++) {
                const pad = this._cells[this._index(x, y)];
                if (pad)
                    callback(pad, x, y);
            }
        }
    }
    getAt(x, y) {
        if (!this._inBounds(x, y))
            return undefined;
        return this._cells[this._index(x, y)];
    }
    addAt(x, y, color) {
        if (!this._areIntegers(x, y))
            return false;
        if (!this._inBounds(x, y))
            return false;
        const index = this._index(x, y);
        if (this._cells[index]) {
            console.log('Pad already exists', x, y);
            return false;
        }
        this._cells[index] = new Pad(color);
        this.dispatch('game-update', undefined, true);
        return true;
    }
    deleteAt(x, y) {
        if (!this._inBounds(x, y))
            return false;
        const index = this._index(x, y);
        if (!this._cells[index])
            return false;
        this._cells[index] = undefined;
        this.dispatch('game-update', undefined, true);
        return true;
    }
    toJSON() {
        const data = {};
        this.forEach((pad, x, y) => {
            const key = String(this._index(x, y));
            data[key] = pad.toJSON();
        });
        return data;
    }
    static fromJSON(width, height, data) {
        return new Pads_1(width, height, data);
    }
    _index(x, y) {
        return x + y * this._stride;
    }
    _inBounds(x, y) {
        const inBounds = x >= 0 && x < this._width && y >= 0 && y < this._height;
        if (!inBounds)
            console.log('Pad out of bounds', x, y);
        return inBounds;
    }
    _areIntegers(x, y) {
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            console.log('Pad position must be integer', x, y);
            return false;
        }
        return true;
    }
};
Pads = Pads_1 = __decorate([
    Register
], Pads);
export { Pads };
//# sourceMappingURL=pads.js.map
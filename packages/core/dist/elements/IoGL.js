var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var IoGl_1;
import { Register } from '../decorators/Register.js';
import { ReactiveProperty } from '../decorators/Property.js';
import { Node } from '../nodes/Node.js';
import { ThemeSingleton, Color } from '../nodes/Theme.js';
import { IoElement } from './IoElement.js';
import { glsl } from './IoGL.glsl.js';
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
gl.getExtension('OES_standard_derivatives');
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.disable(gl.DEPTH_TEST);
const positionBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0.0, -1, -1, 0.0, 1, -1, 0.0, 1, 1, 0.0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
const uvBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 1, 0, 0, 1, 0, 1, 1]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
const indexBuff = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([3, 2, 1, 3, 1, 0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
const shadersCache = new WeakMap();
let currentProgram;
let IoGl = IoGl_1 = class IoGl extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        position: relative;
        overflow: hidden !important;
        @apply --unselectable;
      }
      :host > canvas {
        position: absolute;
        pointer-events: none;
        image-rendering: pixelated;
      }
      :host > span {
        position: absolute;
        text-shadow: 0 0 3px var(--io_bgColorStrong), 0 0 3px var(--io_bgColorStrong), 0 0 3px var(--io_bgColorStrong);
        left: 3px;
        pointer-events: none;
        color: var(--io_colorStrong);
      }
    `;
    }
    // @ReactiveProperty('throttled')
    // declare reactivity: ReactivityType
    #needsResize = false;
    #canvas;
    // #counter: HTMLSpanElement;
    #ctx;
    #vecLengths;
    #shader;
    static get Vert() {
        return /* glsl */ `
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main(void) {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }\n\n`;
    }
    static get GlUtils() {
        return /* glsl */ `
      ${glsl.saturate}
      ${glsl.translate}
      ${glsl.circle}
      ${glsl.rectangle}
      ${glsl.paintDerivativeGrid2D}
      ${glsl.lineVertical}
      ${glsl.lineHorizontal}
      ${glsl.lineCross2d}
      ${glsl.checker}
      ${glsl.checkerX}
      ${glsl.checkerY}
      ${glsl.compose}
    `;
    }
    static get Frag() {
        return /* glsl */ `
      void main(void) {
        gl_FragColor = io_color;
      }\n\n`;
    }
    initPropertyUniform(name, property) {
        const type = property.value.constructor;
        switch (type) {
            case Boolean:
                return 'uniform int ' + name + ';\n';
            case Number:
                return 'uniform float ' + name + ';\n';
            case Array:
                this.#vecLengths[name] = property.value.length;
                return 'uniform vec' + property.value.length + ' ' + name + ';\n';
            case Color:
                this.#vecLengths[name] = 4;
                return 'uniform vec4 ' + name + ';\n';
            default:
        }
        return '';
    }
    initShader() {
        let frag = /* glsl */ `
    #extension GL_OES_standard_derivatives : enable
    precision highp float;\n`;
        this.theme._reactiveProperties.forEach((property, name) => {
            frag += this.initPropertyUniform('io_' + name, property);
        });
        frag += '\n';
        this._reactiveProperties.forEach((property, prop) => {
            const name = 'u' + prop.charAt(0).toUpperCase() + prop.slice(1);
            frag += this.initPropertyUniform(name, property);
        });
        frag += this.constructor.prototype._glUtils;
        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, this.constructor.Vert);
        gl.compileShader(vertShader);
        if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
            const compilationLog = gl.getShaderInfoLog(vertShader);
            console.error('IoGl [Vertex Shader] ' + this.localName + ' error:');
            console.warn(compilationLog);
        }
        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, frag + this.constructor.Frag);
        gl.compileShader(fragShader);
        if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
            const compilationLog = gl.getShaderInfoLog(fragShader);
            console.error('IoGl [Frament Shader] ' + this.localName + ' error:');
            console.warn(compilationLog);
        }
        const program = gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        return program;
    }
    constructor(args = {}) {
        super(args);
        this.#canvas = document.createElement('canvas');
        this.appendChild(this.#canvas);
        this.#ctx = this.#canvas.getContext('2d', { alpha: true });
        // this.#counter = document.createElement('span');
        // this.#counter.innerText = '0';
        // this.appendChild(this.#counter);
        // TODO: improve code clarity
        this.#vecLengths = {};
        this.theme._reactiveProperties.forEach((property, name) => {
            // TODO: consider making more type agnostic
            if (property.type === Color) {
                this.#vecLengths['io_' + name] = 4;
            }
        });
        this._reactiveProperties.forEach((property, name) => {
            const uname = 'u' + name.charAt(0).toUpperCase() + name.slice(1);
            if (property.type === Array) {
                this.#vecLengths[uname] = property.value.length;
            }
        });
        if (shadersCache.has(this.constructor)) {
            this.#shader = shadersCache.get(this.constructor);
        }
        else {
            this.#shader = this.initShader();
            shadersCache.set(this.constructor, this.#shader);
        }
        gl.linkProgram(this.#shader);
        const position = gl.getAttribLocation(this.#shader, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(position);
        const uv = gl.getAttribLocation(this.#shader, 'uv');
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
        gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(uv);
        this.updateThemeUniforms();
    }
    onResized() {
        // TODO: consider optimizing
        const pxRatio = window.devicePixelRatio;
        const rect = this.getBoundingClientRect();
        const style = window.getComputedStyle(this);
        const bw = parseInt(style.borderRightWidth) + parseInt(style.borderLeftWidth);
        const bh = parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
        // TODO: confirm and test
        const width = Math.max(0, Math.floor(rect.width - bw));
        const height = Math.max(0, Math.floor(rect.height - bh));
        const hasResized = (width !== this.size[0] || height !== this.size[1] || pxRatio !== this.pxRatio);
        if (hasResized) {
            // NOTE: Resizing only in inline CSS. Buffer resize postponed until `onRender()`.`
            this.#canvas.style.width = Math.floor(width) + 'px';
            this.#canvas.style.height = Math.floor(height) + 'px';
            this.#needsResize = true;
            this.setProperties({
                size: [width, height],
                pxRatio: pxRatio,
            });
        }
    }
    get ctx() {
        return this.#ctx;
    }
    themeMutated() {
        this.updateThemeUniforms();
        this.debounce(this.onRender);
    }
    changed() {
        this.debounce(this.onRender);
    }
    onRender() {
        const width = Math.floor(this.size[0] * this.pxRatio);
        const height = Math.floor(this.size[1] * this.pxRatio);
        if (!width || !height)
            return;
        this.setShaderProgram();
        // TODO: dont brute-force uniform update.
        this._reactiveProperties.forEach((property, name) => {
            const uname = 'u' + name.charAt(0).toUpperCase() + name.slice(1);
            this.updatePropertyUniform(uname, property);
        });
        if (this.#needsResize) {
            this.#canvas.width = width;
            this.#canvas.height = height;
            this.#needsResize = false;
        }
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.#ctx.clearRect(0, 0, width, height);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        this.#ctx.drawImage(canvas, 0, 0);
        // this.#counter.innerText = String(Number(this.#counter.innerText) + 1);
    }
    setShaderProgram() {
        if (currentProgram !== this.#shader) {
            currentProgram = this.#shader;
            gl.useProgram(this.#shader);
        }
    }
    updatePropertyUniform(name, property) {
        this.setShaderProgram();
        this.setUniform(name, property.value);
    }
    updateThemeUniforms() {
        this.theme._reactiveProperties.forEach((property, name) => {
            this.updatePropertyUniform('io_' + name, property);
        });
    }
    setUniform(name, value) {
        const uniform = gl.getUniformLocation(this.#shader, name);
        if (uniform === null)
            return;
        let type = typeof value;
        if (value instanceof Array)
            type = 'array';
        let _c;
        switch (type) {
            case 'boolean':
                gl.uniform1i(uniform, value ? 1 : 0);
                break;
            case 'number':
                gl.uniform1f(uniform, value ?? 1);
                break;
            case 'object':
            case 'array':
                _c = [0, 1, 2, 3];
                if (typeof value === 'object') {
                    if (value.x !== undefined)
                        _c = ['x', 'y', 'z', 'w'];
                    else if (value.r !== undefined)
                        _c = ['r', 'g', 'b', 'a'];
                    else if (value.h !== undefined)
                        _c = ['h', 's', 'v', 'a'];
                    else if (value.c !== undefined)
                        _c = ['c', 'm', 'y', 'k'];
                }
                switch (this.#vecLengths[name]) {
                    case 2:
                        if (value === undefined) {
                            gl.uniform2f(uniform, 0, 0);
                            break;
                        }
                        gl.uniform2f(uniform, value[_c[0]] ?? 1, value[_c[1]] ?? 1);
                        break;
                    case 3:
                        if (value === undefined) {
                            gl.uniform3f(uniform, 0, 0, 0);
                            break;
                        }
                        gl.uniform3f(uniform, value[_c[0]] ?? 1, value[_c[1]] ?? 1, value[_c[2]] ?? 1);
                        break;
                    case 4:
                        if (value === undefined) {
                            gl.uniform4f(uniform, 0, 0, 0, 0);
                            break;
                        }
                        gl.uniform4f(uniform, value[_c[0]] ?? 1, value[_c[1]] ?? 1, value[_c[2]] ?? 1, value[_c[3]] ?? 1);
                        break;
                    default:
                }
                break;
            default:
        }
    }
    Register(ioNodeConstructor) {
        super.Register(ioNodeConstructor);
        let _glUtils = '';
        const constructors = ioNodeConstructor.prototype._protochain.constructors;
        for (let i = constructors.length; i--;) {
            const constructor = constructors[i];
            const glUtilsProp = Object.getOwnPropertyDescriptor(constructor, 'GlUtils');
            if (glUtilsProp && glUtilsProp.get) {
                _glUtils += constructor.GlUtils;
            }
        }
        Object.defineProperty(ioNodeConstructor.prototype, '_glUtils', { enumerable: false, value: _glUtils });
    }
};
__decorate([
    ReactiveProperty({ type: Node, value: ThemeSingleton })
], IoGl.prototype, "theme", void 0);
__decorate([
    ReactiveProperty({ type: Array, init: [0, 0] })
], IoGl.prototype, "size", void 0);
__decorate([
    ReactiveProperty({ type: Number, value: 1 })
], IoGl.prototype, "pxRatio", void 0);
IoGl = IoGl_1 = __decorate([
    Register
], IoGl);
export { IoGl };
//# sourceMappingURL=IoGL.js.map
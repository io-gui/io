// TODO: document, demo, test

import {html, IoElement} from "./element.js";
import {IoNode} from "./node.js";
import {ProtoProperty, Properties} from "./properties.js";

const animationQueue = new Array();
const animate = function() {
  requestAnimationFrame(animate);
  for (let i = animationQueue.length; i--;) {
    animationQueue[i]();
  }
  animationQueue.length = 0;
};
requestAnimationFrame(animate);

function queueAnimation(func) {
  if (animationQueue.indexOf(func) === -1) {
    animationQueue.push(func);
  }
}

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl', {antialias: false, premultipliedAlpha: false});
gl.imageSmoothingEnabled = false;

gl.getExtension('OES_standard_derivatives');

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.disable(gl.DEPTH_TEST);

const positionBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,0.0,-1,-1,0.0,1,-1,0.0,1,1,0.0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const uvBuff = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,1,0,0,1,0,1,1]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const indexBuff = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([3,2,1,3,1,0]), gl.STATIC_DRAW);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuff);

const shadersCache = new WeakMap();

class IoGlGlobals extends IoNode {
  static get Properties() {
    return {
      background: [0, 0, 0, 1],
      color: [0.7, 0.7, 0.7, 1],
      colorLink: [190/255, 230/255, 150/255, 1],
      colorFocus: [80/255, 210/255, 355/255, 1],
      lineWidth: 1,
    };
  }
  updateValues() {
    const cs = getComputedStyle(document.body);

    const c = cs.getPropertyValue('--io-color').split("(")[1].split(")")[0].split(",");
    c[0] = c[0]/255; c[1] = c[1]/255; c[2] = c[2]/255;

    const b = cs.getPropertyValue('--io-background-color-dark').split("(")[1].split(")")[0].split(",");
    b[0] = b[0]/255; b[1] = b[1]/255; b[2] = b[2]/255;

    const lw = parseInt(cs.getPropertyValue('--io-border-width'));

    this.color = c;
    this.background = b;
    this.lineWidth = lw;
  }
  changed() {
    this.dispatchEvent('object-mutated', {object: this}, false, window);
  }
}
IoGlGlobals.Register();

export const glGlobals = new IoGlGlobals();
glGlobals.connect();

export class IoGl extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        overflow: hidden !important;
        position: relative !important;
        border: 0 !important;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      :host > img {
        position: absolute !important;
        pointer-events: none;
        image-rendering: pixelated;
        width: 100%;
        height: 100%;
      }
    </style>`;
  }
  static get Properties() {
    return {
      size: [0, 0],
      aspect: 1,
      globals: Object,
    };
  }
  static get Vert() {
    return /* glsl */`
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main(void) {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }\n\n`;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;
      void main(void) {
        vec2 px = uSize * vUv;
        px = mod(px, 8.0);
        gl_FragColor = gBackground;
        if (px.x <= 1.0 || px.y <= 1.0) gl_FragColor = vec4(vUv, 0.0, 1.0);
        if (px.x <= 1.0 && px.y <= 1.0) gl_FragColor = gColor;
      }\n\n`;
  }
  globalsMutated() {
    queueAnimation(this.render);
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  constructor(props) {
    super(props);

    this.globals = glGlobals;

    let frag = /* glsl */`
      #extension GL_OES_standard_derivatives : enable
      precision highp float;\n\n`;

    this._arrayLengths = {};

    for (let prop in glGlobals.__properties) {
      const type = glGlobals.__properties[prop].type;
      const protpValue = glGlobals.__protoProperties[prop].value;
      const notify = glGlobals.__properties[prop].notify;
      if (notify) {
        const uName = 'g' + prop.charAt(0).toUpperCase() + prop.slice(1);
        if (type === Boolean) {
          frag += '      uniform int ' + uName + ';\n';
        }
        if (type === Number) {
          frag += '      uniform float ' + uName + ';\n';
        } else if (type === Array) {
          this._arrayLengths[uName] = protpValue.length;
          frag += '      uniform vec' + protpValue.length + ' ' + uName + ';\n';
        }
        // TODO: implement matrices.
      }
    }

    frag += '\n';

    for (let prop in this.__properties) {
      const type = this.__properties[prop].type;
      const protpValue = this.__protoProperties[prop].value;
      const notify = this.__properties[prop].notify;
      if (notify) {
        const uName = 'u' + prop.charAt(0).toUpperCase() + prop.slice(1);
        if (type === Boolean) {
          frag += '      uniform int ' + uName + ';\n';
        }
        if (type === Number) {
          frag += '      uniform float ' + uName + ';\n';
        } else if (type === Array) {
          this._arrayLengths[uName] = protpValue.length;
          frag += '      uniform vec' + protpValue.length + ' ' + uName + ';\n';
        }
        // TODO: implement matrices.
      }
    }

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, this.constructor.Vert);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      let compilationLog = gl.getShaderInfoLog(vertShader);
      console.error('IoGl [Vertex Shader] ' + this.localName + ' error:');
      console.warn(compilationLog);
    }


    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, frag + this.constructor.Frag);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      let compilationLog = gl.getShaderInfoLog(fragShader);
      console.error('IoGl [Frament Shader] ' + this.localName + ' error:');
      console.warn(compilationLog);
    }

    if (shadersCache.has(this.constructor)) {
      this._shader = shadersCache.get(this.constructor);
    } else {
      this._shader = gl.createProgram();
      gl.attachShader(this._shader, vertShader);
      gl.attachShader(this._shader, fragShader);
      shadersCache.set(this.constructor, this._shader);
    }

    gl.linkProgram(this._shader);

    const position = gl.getAttribLocation(this._shader, "position");
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    const uv = gl.getAttribLocation(this._shader, "uv");
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(uv);

    this.template([['img', {id: 'img'}]]);

    this.render = this.render.bind(this);

    this.render(); // TODO: hmm
  }
  onResized() {
    const rect = this.getBoundingClientRect();
    this._width = Math.ceil(rect.width);
    this._height = Math.ceil(rect.height);
    this.changed();
  }
  changed() {
    queueAnimation(this.render);
  }
  render() {
    this.$.img.style.width = this.size[0] ? this.size[0] + 'px' : null;
    this.$.img.style.height = this.size[1] ? this.size[1] + 'px' : null;

    const width = Math.ceil(this.size[0] || this._width || 1);
    const height = Math.ceil(this.size[1] || this._height || 1);
    const pxRatio = window.devicePixelRatio;

    if (!width || !height) return;

    canvas.width = width * pxRatio;
    canvas.height = height * pxRatio;
    gl.viewport(0, 0, width * pxRatio, height * pxRatio);
    gl.clearColor(glGlobals.background[0], glGlobals.background[1], glGlobals.background[2], glGlobals.background[3]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this._shader);

    // TODO: don't brute force uniform update!
    for (let prop in this.__properties) {
      const type = this.__properties[prop].type;
      let value = this.__properties[prop].value;
      const notify = this.__properties[prop].notify;
      if (notify) {
        const uName = 'u' + prop.charAt(0).toUpperCase() + prop.slice(1);
        const uniform = gl.getUniformLocation(this._shader, uName);

        if (prop === 'size') {
          value = [width * pxRatio, height * pxRatio];
        }
        if (prop === 'aspect') {
          value = width / height;
        }
        if (type === Boolean) {
          gl.uniform1i(uniform, value ? 1 : 0);
        }
        if (type === Number) {
          gl.uniform1f(uniform, value || 0);
        } else if (type === Array) {
          let _c = [0, 1, 2, 3];
          if (!(value instanceof Array) && typeof value === 'object') {
            if (value.x !== undefined) _c = ['x', 'y', 'z', 'w'];
            else if (value.r !== undefined) _c = ['r', 'g', 'b', 'a'];
            else if (value.h !== undefined) _c = ['h', 's', 'v', 'a'];
            else if (value.c !== undefined) _c = ['c', 'm', 'y', 'k'];
          }
          const length = this._arrayLengths[uName];
          switch (length) {
            case 2:
            gl.uniform2f(uniform,
              value[_c[0]] !== undefined ? value[_c[0]] : 1,
              value[_c[1]] !== undefined ? value[_c[1]] : 1);
            break;
            case 3:
            gl.uniform3f(uniform,
              value[_c[0]] !== undefined ? value[_c[0]] : 1,
              value[_c[1]] !== undefined ? value[_c[1]] : 1,
              value[_c[2]] !== undefined ? value[_c[2]] : 1);
            break;
            case 4:
            gl.uniform4f(uniform,
              value[_c[0]] !== undefined ? value[_c[0]] : 1,
              value[_c[1]] !== undefined ? value[_c[1]] : 1,
              value[_c[2]] !== undefined ? value[_c[2]] : 1,
              value[_c[3]] !== undefined ? value[_c[3]] : 1);
            break;
            default:
          }
        }
      }
    }

    // TODO: don't brute force uniform update!
    for (let prop in glGlobals.__properties) {
      const type = glGlobals.__properties[prop].type;
      let value = glGlobals.__properties[prop].value;
      const notify = glGlobals.__properties[prop].notify;
      if (notify) {
        const uName = 'g' + prop.charAt(0).toUpperCase() + prop.slice(1);
        const uniform = gl.getUniformLocation(this._shader, uName);
        // console.log(uName);

        // if (prop === 'size') {
        //   value = [width * pxRatio, height * pxRatio];
        // }
        // if (prop === 'aspect') {
        //   value = width / height;
        // }
        if (type === Boolean) {
          gl.uniform1i(uniform, value ? 1 : 0);
        }
        if (type === Number) {
          gl.uniform1f(uniform, value || 0);
        } else if (type === Array) {
          let _c = [0, 1, 2, 3];
          if (!(value instanceof Array) && typeof value === 'object') {
            if (value.x !== undefined) _c = ['x', 'y', 'z', 'w'];
            else if (value.r !== undefined) _c = ['r', 'g', 'b', 'a'];
            else if (value.h !== undefined) _c = ['h', 's', 'v', 'a'];
            else if (value.c !== undefined) _c = ['c', 'm', 'y', 'k'];
          }
          const length = this._arrayLengths[uName];
          switch (length) {
            case 2:
            gl.uniform2f(uniform,
              value[_c[0]] !== undefined ? value[_c[0]] : 1,
              value[_c[1]] !== undefined ? value[_c[1]] : 1);
            break;
            case 3:
            gl.uniform3f(uniform,
              value[_c[0]] !== undefined ? value[_c[0]] : 1,
              value[_c[1]] !== undefined ? value[_c[1]] : 1,
              value[_c[2]] !== undefined ? value[_c[2]] : 1);
            break;
            case 4:
            gl.uniform4f(uniform,
              value[_c[0]] !== undefined ? value[_c[0]] : 1,
              value[_c[1]] !== undefined ? value[_c[1]] : 1,
              value[_c[2]] !== undefined ? value[_c[2]] : 1,
              value[_c[3]] !== undefined ? value[_c[3]] : 1);
            break;
            default:
          }
        }
      }
    }

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    this.$.img.src = canvas.toDataURL('image/png', 0.9);
  }
}

IoGl.Register();

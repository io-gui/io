// TODO: document, demo, test

import {html, IoElement} from "../core/element.js";

const animationQueue = [];
const animate = function() {
  for (let i = animationQueue.length; i--;) {
    animationQueue[i]();
  }
  animationQueue.lenght = 0;
  requestAnimationFrame(animate);
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

// TODO: fix sizing logic

export class IoQuad extends IoElement {
  static get style() {
    return html`<style>
      :host {
        user-select: none;
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
      }
      :host > canvas {
        flex: 1 1 auto;
        pointer-events: none;
        image-rendering: pixelated;
      }
    </style>`;
  }
  static get properties() {
    return {
      bg: [0, 0, 0, 1],
      color: [1, 1, 1, 1],
      size: [1, 1],
    };
  }
  static get vert() {
    return /* glsl */`
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main(void) {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;
  }
  static get frag() {
    return /* glsl */`
      varying vec2 vUv;
      void main(void) {
        vec2 px = size * vUv;
        px = mod(px, 5.0);
        if (px.x > 1.0 && px.y > 1.0) discard;
        gl_FragColor = color;
      }
    `;
  }
  constructor(props) {
    super(props);

    let frag = /* glsl */`
      #extension GL_OES_standard_derivatives : enable
      precision mediump float;
    `;

    for (let prop in this.__properties) {
      let type = this.__properties[prop].type;
      let value = this.__properties[prop].value;
      if (type === Number) {
        frag += 'uniform float ' + prop + ';\n';
      } else if (type === Array) {
        frag += 'uniform vec' + value.length + ' ' + prop + ';\n';
      }
      // TODO: implement bool and matrices.
    }

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, this.constructor.vert);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, frag + this.constructor.frag);
    gl.compileShader(fragShader);

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

    this.template([['canvas', {id: 'canvas'}]]);
    this._context2d = this.$.canvas.getContext('2d');
    this._context2d.imageSmoothingEnabled = false;

    this.render();
  }
  resized() {
    const rect = this.$.canvas.getBoundingClientRect();
    this.size[0] = rect.width;
    this.size[1] = rect.height;
    this.changed();
  }
  changed() {
    queueAnimation(this.render);
  }
  render() {
    if (!this._shader) return;
    if (!this.__properties.size) return;

    canvas.width = this.size[0];
    canvas.height = this.size[1];

    gl.viewport(0, 0, this.size[0], this.size[1]);
    gl.clearColor(this.bg[0], this.bg[1], this.bg[2], this.bg[3]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this._shader);

    for (let prop in this.__properties) {
      let type = this.__properties[prop].type;
      let value = this.__properties[prop].value;
      if (type === Number) {
        const uniform = gl.getUniformLocation(this._shader, prop);
        gl.uniform1f(uniform, value || 0);
      } else if (type === Array) {
        const uniform = gl.getUniformLocation(this._shader, prop);
        switch (value.length) {
          case 2:
            gl.uniform2f(uniform, value[0], value[1]);
            break;
          case 3:
            gl.uniform3f(uniform, value[0], value[1], value[2]);
            break;
          case 4:
            gl.uniform4f(uniform, value[0], value[1], value[2], value[3]);
            break;
          default:
        }
      }
    }

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    if (this._context2d && canvas.width && canvas.height) {
      this.$.canvas.width = canvas.width;
      this.$.canvas.height = canvas.height;
      this._context2d.drawImage(canvas, 0, 0, canvas.width, canvas.height);
    }
  }
}

IoQuad.Register();

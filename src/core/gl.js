// TODO: document, demo, test

import {html, IoElement} from "./element.js";

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

// TODO: fix sizing logic

export class IoGl extends IoElement {
  static get Style() {
    return html`<style>
      :host {
        overflow: hidden !important;
        position: relative !important;
        border: 0 !important;
      }
      :host > img {
        position: absolute !important;
        user-select: none;
        pointer-events: none;
        image-rendering: pixelated;
        width: 100%;
        height: 100%;
      }
    </style>`;
  }
  static get Properties() {
    return {
      background: [0, 0, 0, 1],
      color: [1, 1, 1, 1],
      size: [0, 0],
      aspect: 1,
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
      }
    `;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;
      void main(void) {
        vec2 px = size * vUv;
        px = mod(px, 8.0);
        gl_FragColor = background;
        if (px.x <= 1.0 || px.y <= 1.0) gl_FragColor = vec4(vUv, 0.0, 1.0);
        if (px.x <= 1.0 && px.y <= 1.0) gl_FragColor = color;
      }
    `;
  }
  constructor(props) {
    super(props);

    let frag = /* glsl */`
      #extension GL_OES_standard_derivatives : enable
      precision highp float;
    `;

    for (let prop in this.__properties) {
      let type = this.__properties[prop].type;
      let value = this.__properties[prop].value;
      if (type === Boolean) {
        frag += 'uniform int ' + prop + ';\n';
      }
      if (type === Number) {
        frag += 'uniform float ' + prop + ';\n';
      } else if (type === Array) {
        frag += 'uniform vec' + value.length + ' ' + prop + ';\n';
      }
      // TODO: implement bool and matrices.
    }

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, this.constructor.Vert);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      var compilationLog = gl.getShaderInfoLog(vertShader);
      console.error('IoGl [Vertex Shader]: ' + compilationLog);
    }


    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, frag + this.constructor.Frag);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      var compilationLog = gl.getShaderInfoLog(fragShader);
      console.error('IoGl [Frament Shader]: ' + compilationLog);
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

    this.render(); // TODO: hmm
  }
  onResized() {
    const rect = this.getBoundingClientRect();
    this._width = Math.ceil(rect.width);
    this._height = Math.ceil(rect.height);
    this.changed();
  }
  changed() {
    this.style.width = this.size[0] ? this.size[0] + 'px' : null;
    this.style.height = this.size[1] ? this.size[1] + 'px' : null;
    queueAnimation(this.render.bind(this));
  }
  render() {

    const width = Math.ceil(this.size[0] || this._width || 1);
    const height = Math.ceil(this.size[1] || this._height || 1);
    const pxRatio = window.devicePixelRatio;

    if (!width || !height) return;

    canvas.width = width * pxRatio;
    canvas.height = height * pxRatio;
    gl.viewport(0, 0, width * pxRatio, height * pxRatio);
    gl.clearColor(this.background[0], this.background[1], this.background[2], this.background[3]);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this._shader);

    for (let prop in this.__properties) {
      let type = this.__properties[prop].type;
      let value = this.__properties[prop].value;
      if (prop === 'size') {
        value = [width * pxRatio, height * pxRatio];
      }
      if (prop === 'aspect') {
        value = width / height;
      }
      if (type === Boolean) {
        const uniform = gl.getUniformLocation(this._shader, prop);
        gl.uniform1i(uniform, value ? 1 : 0);
      }
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

    this.$.img.src = canvas.toDataURL('image/png', 0.9);
  }
}

IoGl.Register();

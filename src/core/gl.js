import {html, IoElement} from "./element.js";
import {IoThemeSingleton} from "./theme.js";

// TODO: document and test

export const glChunk = {
  translate: `vec2 translate(vec2 samplePosition, float x, float y){
    return samplePosition - vec2(x, y);
  }\n`,
  circle: `float circle(vec2 samplePosition, float radius){
    return saturate(length(samplePosition) - radius);
  }\n`,
  grid: `float grid(vec2 samplePosition, float gridWidth, float gridHeight, float lineWidth) {
    vec2 sp = samplePosition / vec2(gridWidth, gridHeight);
    float hw = lineWidth / 2.0;
    float linex = abs(fract(sp.x - 0.5) - 0.5) / abs(dFdx(sp.x)) - hw;
    float liney = abs(fract(sp.y - 0.5) - 0.5) / abs(dFdy(sp.y)) - hw;
    return saturate(min(linex, liney));
  }\n`,
  hue2rgb: `vec3 hue2rgb(float hue) {
    float R = abs(hue * 6. - 3.) - 1.;
    float G = 2. - abs(hue * 6. - 2.);
    float B = 2. - abs(hue * 6. - 4.);
    return saturate(vec3(R,G,B));
  }\n`,
  hsv2rgb: `vec3 hsv2rgb(vec3 hsv) {
    vec3 rgb = hue2rgb(hsv.r);
    return ((rgb - 1.0) * hsv.g + 1.0) * hsv.b;
  }\n`,
};

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
let currentProgram;

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
      pxRatio: 1,
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
        gl_FragColor = cssBackgroundColor;
        if (px.x <= 1.0 || px.y <= 1.0) gl_FragColor = vec4(vUv, 0.0, 1.0);
        if (px.x <= 1.0 && px.y <= 1.0) gl_FragColor = cssColor;
      }\n\n`;
  }
  initPropertyUniform(name, property) {
    if (property.notify) {
      switch (property.type) {
        case Boolean:
          return 'uniform int ' + name + ';\n';
        case Number:
          return 'uniform float ' + name + ';\n';
        case Array:
          this._vecLengths[name] = property.value.length;
          return 'uniform vec' + property.value.length + ' ' + name + ';\n';
        default:
      }
      // TODO: implement matrices.
    }
    return '';
  }
  constructor(props) {
    super(props);

    this.globals = IoThemeSingleton;

    let frag = /* glsl */`
      #extension GL_OES_standard_derivatives : enable
      precision highp float;
      #ifndef saturate
        #define saturate(v) clamp(v, 0., 1.)
      #endif\n\n`;

    this._vecLengths = {};

    for (let name in IoThemeSingleton.__properties) {
      const property = IoThemeSingleton.__protoProperties[name];
      frag += this.initPropertyUniform(name, property);
    }

    frag += '\n';

    for (let prop in this.__properties) {
      const name = 'u' + prop.charAt(0).toUpperCase() + prop.slice(1);
      const property = this.__protoProperties[prop];
      frag += this.initPropertyUniform(name, property);
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

    this.updateCssUniforms();
  }
  onResized() {
    const rect = this.getBoundingClientRect();
    const pxRatio = window.devicePixelRatio;
    const width = Math.ceil(rect.width * pxRatio);
    const height = Math.ceil(rect.height * pxRatio);
    this.setProperties({
      size: [width, height],
      aspect: width / height,
      pxRatio: pxRatio,
    });
  }
  globalsMutated() {
    this.updateCssUniforms();
    queueAnimation(this.render);
  }
  // TODO: make better uniform update
  // propertyChanged(event) {
  //   const p = event.detail.property;
  //   const name = 'u' + p.charAt(0).toUpperCase() + p.slice(1);
  //   this.updatePropertyUniform(name, this.__properties[p]);
  // }
  changed() {
    queueAnimation(this.render);
  }
  render() {
    const width = this.size[0];
    const height = this.size[1];

    if (!width || !height) return;

    this.setShaderProgram();

    // TODO: dont brute-force uniform update.
    for (let p in this.__properties) {
      const name = 'u' + p.charAt(0).toUpperCase() + p.slice(1);
      this.updatePropertyUniform(name, this.__properties[p]);
    }

    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.$.img.src = canvas.toDataURL('image/png', 0.9);
  }
  setShaderProgram() {
    if (currentProgram !== this._shader) {
      currentProgram = this._shader;
      gl.useProgram(this._shader);
    }
  }
  updatePropertyUniform(name, property) {
    this.setShaderProgram();
    if (property.notify) {
      this.setUniform(name, property.type, property.value);
    }
  }
  updateCssUniforms() {
    this.setShaderProgram();
    for (let name in IoThemeSingleton.__properties) {
      this.updatePropertyUniform(name, IoThemeSingleton.__properties[name]);
    }
  }
  setUniform(name, type, value) {
    const uniform = gl.getUniformLocation(this._shader, name);
    let _c;
    switch (type) {
      case Boolean:
        gl.uniform1i(uniform, value ? 1 : 0);
        break;
      case Number:
        gl.uniform1f(uniform, value || 0);
        break;
      case Array:
        _c = [0, 1, 2, 3];
        if (!(value instanceof Array) && typeof value === 'object') {
          if (value.x !== undefined) _c = ['x', 'y', 'z', 'w'];
          else if (value.r !== undefined) _c = ['r', 'g', 'b', 'a'];
          else if (value.h !== undefined) _c = ['h', 's', 'v', 'a'];
          else if (value.c !== undefined) _c = ['c', 'm', 'y', 'k'];
        }
        switch (this._vecLengths[name]) {
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
        break;
      default:
    }
  }
}

IoGl.Register();

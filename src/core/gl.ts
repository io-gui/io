import { IoElement, RegisterIoElement } from './element.js';
import { PropertyInstance, PropertyDeclaration, Property } from './internals/property.js';
import { IoTheme, IoThemeSingleton, Color } from './theme.js';

const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl', {antialias: false, premultipliedAlpha: true}) as WebGLRenderingContext;
// TODO: disable filtering (image-rendering: pixelated)?

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
let currentProgram: WebGLProgram | null;

@RegisterIoElement
export class IoGl extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        position: relative;
        overflow: hidden !important;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }
      :host > canvas {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: calc(var(--ioBorderRadius) - var(--ioBorderWidth));
        pointer-events: none;
        image-rendering: pixelated;
      }
      :host[aria-invalid] {
        border: var(--ioBorderError);
      }
      :host[aria-invalid] > canvas {
        opacity: 0.5;
      }
      :host:focus {
        border-color: var(--ioBorderColorFocus);
        outline: 1px solid var(--ioBorderColorFocus);
      }
    `;
  }
  @Property({value: [0, 0]})
  declare size: [number, number];

  @Property({value: [1, 1, 1, 1], observe: true})
  declare color: [number, number, number, number];

  @Property({value: 1})
  declare pxRatio: number;

  @Property({observe: true, type: IoTheme})
  declare theme: IoTheme;

  private _needsResize = false;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

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
  static get GlUtils() {
    return /* glsl */`
      #ifndef saturate
        #define saturate(v) clamp(v, 0., 1.)
      #endif

      // Transform functions
      vec2 translate(vec2 samplePosition, vec2 xy){
        return samplePosition - vec2(xy.x, xy.y);
      }
      vec2 translate(vec2 samplePosition, float x, float y){
        return samplePosition - vec2(x, y);
      }

      // SDF functions
      float circle(vec2 samplePosition, float radius){
        return saturate((length(samplePosition) - radius) * uPxRatio);
      }
      float rectangle(vec2 samplePosition, vec2 halfSize){
        vec2 edgeDistance = abs(samplePosition) - halfSize;
        float outside = length(max(edgeDistance, 0.));
        float inside = min(max(edgeDistance.x, edgeDistance.y), 0.);
        return saturate((outside + inside) * uPxRatio); // TODO: check
      }
      float grid2d(vec2 samplePosition, vec2 gridSize, float lineWidth) {
        vec2 sp = samplePosition / vec2(gridSize.x, gridSize.y);
        float linex = (abs(fract(sp.x - 0.5) - 0.5) * 2.0 / abs(max(dFdx(sp.x), dFdy(sp.x))) - lineWidth);
        float liney = (abs(fract(sp.y - 0.5) - 0.5) * 2.0 / abs(max(dFdy(sp.y), dFdx(sp.y))) - lineWidth);
        return 1.0 - saturate(min(linex, liney));
      }
      float lineVertical(vec2 samplePosition, float lineWidth) {
        return (abs(samplePosition.x) * 2.0 > lineWidth) ? 0.0 : 1.0;
      }
      float lineHorizontal(vec2 samplePosition, float lineWidth) {
        return (abs(samplePosition.y) * 2.0 > lineWidth) ? 0.0 : 1.0;
      }
      float lineCross2d(vec2 samplePosition, float lineWidth) {
        return (min(abs(samplePosition.x), abs(samplePosition.y)) * 2.0 > lineWidth) ? 0.0 : 1.0;
      }
      float checker(vec2 samplePosition, float size) {
        vec2 checkerPos = floor(samplePosition / size);
        float checkerMask = mod(checkerPos.x + mod(checkerPos.y, 2.0), 2.0);
        return checkerMask;
      }
      float checkerX(vec2 samplePosition, float size) {
        vec2 checkerPos = floor(samplePosition / size);
        float checkerMask = mod(checkerPos.x, 2.0);
        return checkerMask;
      }
      float checkerY(vec2 samplePosition, float size) {
        vec2 checkerPos = floor(samplePosition / size);
        float checkerMask = mod(checkerPos.y, 2.0);
        return checkerMask;
      }
      vec3 hue2rgb(float hue) {
        hue = fract(hue);
        float R = abs(hue * 6. - 3.) - 1.;
        float G = 2. - abs(hue * 6. - 2.);
        float B = 2. - abs(hue * 6. - 4.);
        return saturate(vec3(R,G,B));
      }
      vec3 hsv2rgb(vec3 hsv) {
        vec3 rgb = hue2rgb(hsv.r);
        return ((rgb - 1.) * hsv.g + 1.) * hsv.b;
      }
      vec3 hsl2rgb(vec3 hsl) {
        vec3 rgb = hue2rgb(hsl.x);
        float C = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
        return (rgb - 0.5) * C + hsl.z;
      }
      vec3 cmyk2rgb(vec4 cmyk) {
        float r = 1. - min(1., cmyk.x * (1. - cmyk.w) + cmyk.w);
        float g = 1. - min(1., cmyk.y * (1. - cmyk.w) + cmyk.w);
        float b = 1. - min(1., cmyk.z * (1. - cmyk.w) + cmyk.w);
        return vec3(r, g, b);
      }
      // Compositing functions
      vec3 compose(vec3 dst, vec4 src) {
        return mix(dst, src.rgb, src.a);
      }
      // Painter Functions
      vec3 paintHorizontalLine(vec3 dstCol, vec2 p, vec3 color) {
        float lineShape = lineHorizontal(p, ioStrokeWidth);
        return compose(dstCol, vec4(color, lineShape));
      }
    `;
  }
  static get Frag() {
    return /* glsl */`
      varying vec2 vUv;
      void main(void) {
        vec2 position = uSize * vUv;
        float gridWidth = 8. * uPxRatio;
        float lineWidth = 1. * uPxRatio;
        float gridShape = grid2d(position, vec2(gridWidth), lineWidth);
        gl_FragColor = mix(vec4(vUv, 0.0, 1.0), uColor, gridShape);
      }\n\n`;
  }
  //TODO: this is possible an error. property should be PropertyDeclaration
  initPropertyUniform(name: string, property: PropertyDeclaration) {
    if (property.notify) {
      switch (property.type) {
        case Boolean:
          return 'uniform int ' + name + ';\n';
        case Number:
          return 'uniform float ' + name + ';\n';
        case Array:
          this._vecLengths[name] = property.value.length;
          return 'uniform vec' + property.value.length + ' ' + name + ';\n';
        case Color:
          this._vecLengths[name] = 4;
          return 'uniform vec4 ' + name + ';\n';
        default:
      }
    }
    return '';
  }
  initShader() {
    let frag = /* glsl */`
    #extension GL_OES_standard_derivatives : enable
    precision highp float;\n`;

    this.theme._properties.forEach((property, name) => {
      frag += this.initPropertyUniform(name, property);
    });

    frag += '\n';

    this._properties.forEach((property, prop) => {
      const name = 'u' + prop.charAt(0).toUpperCase() + prop.slice(1);
      frag += this.initPropertyUniform(name, property);
    });

    for (let i = this._protochain.constructors.length; i--;) {
      const constructor = this._protochain.constructors[i];
      const glUtilsProp = Object.getOwnPropertyDescriptor(constructor, 'GlUtils');
      if (glUtilsProp && glUtilsProp.get) {
        frag += (constructor as typeof IoGl).GlUtils;
      }
    }

    const vertShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(vertShader, (this.constructor as any).Vert);
    gl.compileShader(vertShader);

    if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
      const compilationLog = gl.getShaderInfoLog(vertShader);
      console.error('IoGl [Vertex Shader] ' + this.localName + ' error:');
      console.warn(compilationLog);
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(fragShader, frag + (this.constructor as any).Frag);
    gl.compileShader(fragShader);

    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
      const compilationLog = gl.getShaderInfoLog(fragShader);
      console.error('IoGl [Frament Shader] ' + this.localName + ' error:');
      console.warn(compilationLog);
    }

    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);

    return program;
  }
  constructor(properties: Record<string, any> = {}) {
    properties.theme = IoThemeSingleton;

    super(properties);

    // TODO: improve code clarity
    this._vecLengths = {};
    this.theme._properties.forEach((property, name) => {
      // TODO: consider making more type agnostic
      if (property.notify && property.type === Color) {
        this._vecLengths[name] = 4;
      }
    });

    this._properties.forEach((property, name) => {
      const uname = 'u' + name.charAt(0).toUpperCase() + name.slice(1);
      if (property.notify && property.type === Array) {
        this._vecLengths[uname] = property.value.length;
      }
    });

    if (shadersCache.has(this.constructor)) {
      this._shader = shadersCache.get(this.constructor);
    } else {
      this._shader = this.initShader();
      shadersCache.set(this.constructor, this._shader);
    }

    gl.linkProgram(this._shader);

    const position = gl.getAttribLocation(this._shader, 'position');
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuff);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);

    const uv = gl.getAttribLocation(this._shader, 'uv');
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuff);
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(uv);

    this._canvas = document.createElement('canvas');
    this.appendChild(this._canvas);
    this._ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;

    this.updateThemeUniforms();
  }
  onResized() {
    // TODO: consider optimizing
    const pxRatio = window.devicePixelRatio;
    const rect = this.getBoundingClientRect();
    const style = window.getComputedStyle(this as unknown as HTMLElement);
    const bw = parseInt(style.borderRightWidth) + parseInt(style.borderLeftWidth);
    const bh = parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);

    // TODO: confirm and test
    const width = Math.max(0, Math.floor(rect.width - bw));
    const height = Math.max(0, Math.floor(rect.height - bh));

    const hasResized = (width !== this.size[0] || height !== this.size[1] || pxRatio !== this.pxRatio);

    if (hasResized) {
      // NOTE: Resizing only in inline CSS. Buffer resize postponed until `_onRender()`.`
      this._canvas.style.width = Math.floor(width) + 'px';
      this._canvas.style.height = Math.floor(height) + 'px';
      this._needsResize = true;

      this.setProperties({
        size: [width, height],
        pxRatio: pxRatio,
      });
    }
  }
  themeMutated() {
    this.updateThemeUniforms();
    this.throttle(this._onRender);
  }
  changed() {
    // TODO: unhack when ResizeObserver is available in Safari
    if (!window.ResizeObserver) {
      setTimeout(() => {
        this.onResized();
        this.throttle(this._onRender);
      });
    } else {
      this.throttle(this._onRender);
    }
  }
  _onRender() {
    const width = this.size[0] * this.pxRatio;
    const height = this.size[1] * this.pxRatio;

    if (!width || !height) return;

    this.setShaderProgram();

    // TODO: dont brute-force uniform update.
    this._properties.forEach((property, name) => {
      const uname = 'u' + name.charAt(0).toUpperCase() + name.slice(1);
      this.updatePropertyUniform(uname, property);
    });

    if (this._needsResize) {
      this._canvas.width = Math.floor(width);
      this._canvas.height = Math.floor(height);
      this._needsResize = false;
    }

    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);

    // gl.clearColor(0, 0, 0, 1);
    // gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // this._canvas.src = canvas.toDataURL('image/png', 0.9);
    // this._canvas.loading = true;

    // this._ctx.clearRect(0, 0, canvas.width, canvas.height);
    this._ctx.drawImage(canvas, 0, 0);
  }
  setShaderProgram() {
    if (currentProgram !== this._shader) {
      currentProgram = this._shader;
      gl.useProgram(this._shader);
    }
  }
  updatePropertyUniform(name: string, property: PropertyInstance) {
    this.setShaderProgram();
    if (property.notify) {
      this.setUniform(name, property.value);
    }
  }
  updateThemeUniforms() {
    this.theme._properties.forEach((property, name) => {
      this.updatePropertyUniform(name, property);
    });
  }
  setUniform(name: string, value: any) {
    const uniform = gl.getUniformLocation(this._shader, name);
    let type: string = typeof value;
    if (value instanceof Array) type = 'array';
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
          // console.log(value);
          if (value.x !== undefined) _c = ['x', 'y', 'z', 'w'];
          else if (value.r !== undefined) _c = ['r', 'g', 'b', 'a'];
          else if (value.h !== undefined) _c = ['h', 's', 'v', 'a'];
          else if (value.c !== undefined) _c = ['c', 'm', 'y', 'k'];
        }
        switch (this._vecLengths[name]) {
          case 2:
            if (value === undefined) {
              gl.uniform2f(uniform, 0, 0);
              break;
            }
            gl.uniform2f(uniform,
                value[_c[0]] ?? 1,
                value[_c[1]] ?? 1);
            break;
          case 3:
            if (value === undefined) {
              gl.uniform3f(uniform, 0, 0, 0);
              break;
            }
            gl.uniform3f(uniform,
                value[_c[0]] ?? 1,
                value[_c[1]] ?? 1,
                value[_c[2]] ?? 1);
            break;
          case 4:
            if (value === undefined) {
              gl.uniform4f(uniform, 0, 0, 0, 0);
              break;
            }
            gl.uniform4f(uniform,
                value[_c[0]] ?? 1,
                value[_c[1]] ?? 1,
                value[_c[2]] ?? 1,
                value[_c[3]] ?? 1);
                break;
          default:
        }
        break;
      default:
    }
  }
}

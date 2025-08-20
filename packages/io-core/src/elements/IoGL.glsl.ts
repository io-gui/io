const saturate = /* glsl */`
  #ifndef saturate
    #define saturate(v) clamp(v, 0., 1.)
  #endif
`;

// Transform functions
const translate = /* glsl */`
  vec2 translate(vec2 samplePosition, vec2 xy){
    return samplePosition - vec2(xy.x, xy.y);
  }
  vec2 translate(vec2 samplePosition, float x, float y){
    return samplePosition - vec2(x, y);
  }
`;

// SDF functions
const circle = /* glsl */`
  float circle(vec2 samplePosition, float radius){
    return saturate((length(samplePosition) - radius) * uPxRatio);
  }
`;
const rectangle = /* glsl */`
  float rectangle(vec2 samplePosition, vec2 halfSize){
    vec2 edgeDistance = abs(samplePosition) - halfSize;
    float outside = length(max(edgeDistance, 0.));
    float inside = min(max(edgeDistance.x, edgeDistance.y), 0.);
    return 1.0 - saturate((outside + inside) * 1000000.0);
  }
`;
const paintDerivativeGrid2D = /* glsl*/`
  float paintDerivativeGrid2D(vec2 samplePosition, vec2 gridWidth, float lineWidth) {
    vec2 sp = samplePosition / gridWidth;
    float fractx = abs(fract(sp.x - 0.5) - 0.5) * 2.0;
    float fracty = abs(fract(sp.y - 0.5) - 0.5) * 2.0;

    float sx = ((sp.x - 0.5) - 0.5) * 2.0;
    float sy = ((sp.y - 0.5) - 0.5) * 2.0;
    
    float absx = abs(max(dFdx(sx), dFdy(sx)));
    float absy = abs(max(dFdy(sy), dFdx(sy)));

    float fadeX = 1.0 - dFdx(sx);
    float fadeY = 1.0 - dFdy(sx);
    if (fadeX <= 0.0 || fadeY <= 0.0) return 1.0;

    float linex = fractx / absx - (0.5 * max(uPxRatio, 2.0) * lineWidth - 1.0) - 0.5;
    float liney = fracty / absy - (0.5 * max(uPxRatio, 2.0) * lineWidth - 1.0) - 0.5;

    return (1.0 - saturate(min(linex, liney)));
  }
`;
const lineVertical = /* glsl*/`
  float lineVertical(vec2 samplePosition, float lineWidth) {
    return (abs(samplePosition.x) * 2.0 > lineWidth) ? 0.0 : 1.0;
  }
`;
const lineHorizontal = /* glsl*/`
  float lineHorizontal(vec2 samplePosition, float lineWidth) {
    return (abs(samplePosition.y) * 2.0 > lineWidth) ? 0.0 : 1.0;
  }
`;
const lineCross2d = /* glsl*/`
  float lineCross2d(vec2 samplePosition, float lineWidth) {
    return (min(abs(samplePosition.x), abs(samplePosition.y)) * 2.0 > lineWidth) ? 0.0 : 1.0;
  }
`;
const checker = /* glsl*/`
  float checker(vec2 samplePosition, float size) {
    vec2 checkerPos = floor(samplePosition / size);
    float checkerMask = mod(checkerPos.x + mod(checkerPos.y, 2.0), 2.0);
    return checkerMask;
  }
`;
const checkerX = /* glsl*/`
  float checkerX(vec2 samplePosition, float size) {
    vec2 checkerPos = floor(samplePosition / size);
    float checkerMask = mod(checkerPos.x, 2.0);
    return checkerMask;
  }
`;
const checkerY = /* glsl*/`
  float checkerY(vec2 samplePosition, float size) {
    vec2 checkerPos = floor(samplePosition / size);
    float checkerMask = mod(checkerPos.y, 2.0);
    return checkerMask;
  }
`;

// Compositing functions
const compose = /* glsl*/`
  vec3 compose(vec3 dst, vec4 src) {
    return mix(dst, src.rgb, src.a);
  }
`;

/**
 * GLSL Color Functions
 */

const hue2rgb = /* glsl*/`
  vec3 hue2rgb(float hue) {
    hue = fract(hue);
    float R = abs(hue * 6. - 3.) - 1.;
    float G = 2. - abs(hue * 6. - 2.);
    float B = 2. - abs(hue * 6. - 4.);
    return saturate(vec3(R,G,B));
  }
`;

const hsv2rgb = /* glsl*/`
  vec3 hsv2rgb(vec3 hsv) {
    vec3 rgb = hue2rgb(hsv.r);
    return ((rgb - 1.) * hsv.g + 1.) * hsv.b;
  }
`;

const hsl2rgb = /* glsl*/`
  vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb = hue2rgb(hsl.x);
    float C = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
    return (rgb - 0.5) * C + hsl.z;
  }
`;

export const glsl = {
  saturate,
  translate,
  circle,
  rectangle,
  paintDerivativeGrid2D,
  lineVertical,
  lineHorizontal,
  lineCross2d,
  checker,
  checkerX,
  checkerY,
  compose,
  hue2rgb,
  hsv2rgb,
  hsl2rgb,
};

export function filterObject(object, predicate) {
  if (predicate(object)) return object;
  for (let key in object) {
    if (predicate(object[key])) {
        return object[key];
    } else if (typeof object[key] === 'object') {
      const prop = filterObject(object[key], predicate);
      if (prop) return prop;
    }
  }
}

export const shaderChunk = {
  saturate: `
  #ifndef saturate
    #define saturate(v) clamp(v, 0., 1.)
  #endif\n`,
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
}

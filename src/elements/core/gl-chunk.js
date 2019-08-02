export const chunk = {
  translate: `vec2 translate(vec2 samplePosition, float x, float y){
    return samplePosition - vec2(x, y);
  }\n`,
  circle: `float circle(vec2 samplePosition, float radius){
    return saturate(length(samplePosition) - radius);
  }\n`,
  rectangle: `float rectangle(vec2 samplePosition, vec2 halfSize){
    vec2 edgeDistance = abs(samplePosition) - halfSize;
    float outside = length(max(edgeDistance, 0.));
    float inside = min(max(edgeDistance.x, edgeDistance.y), 0.);
    return saturate(outside + inside);
  }\n`,
  grid: `float grid(vec2 samplePosition, float gridWidth, float gridHeight, float lineWidth) {
    vec2 sp = samplePosition / vec2(gridWidth, gridHeight);
    float hw = lineWidth / 2.0;
    float linex = abs(fract(sp.x - 0.5) - 0.5) / abs(dFdx(sp.x)) - hw;
    float liney = abs(fract(sp.y - 0.5) - 0.5) / abs(dFdy(sp.y)) - hw;
    return saturate(min(linex, liney) * 2.0);
  }\n`,
  checker: `float checker(vec2 samplePosition, float size) {
    vec2 checkerPos = floor(samplePosition / size);
    float checkerMask = mod(checkerPos.x + mod(checkerPos.y, 2.0), 2.0);
    return checkerMask;
  }\n`,
};

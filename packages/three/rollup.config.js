import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/three/build/index.js', 'packages/three/bundle/index.js'),
  makeBundleTarget('packages/three/build/demos/IothreeDemo.js', 'packages/three/bundle/demos/IothreeDemo.js'),
  makeBundleTarget('packages/three/build/index.test.js', 'packages/three/bundle/index.test.js'),
];

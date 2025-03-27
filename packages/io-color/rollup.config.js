import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-color/build/index.js', 'packages/io-color/bundle/index.js', ['io-gui', 'io-sliders']),
  makeBundleTarget('packages/io-color/build/index.test.js', 'packages/io-color/bundle/index.test.js', ['io-gui', 'io-sliders', 'packages/io-color/build/index.js']),
];

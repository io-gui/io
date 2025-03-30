import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-colors/build/index.js', 'packages/io-colors/bundle/index.js', ['io-gui', 'io-sliders']),
  makeBundleTarget('packages/io-colors/build/index.test.js', 'packages/io-colors/bundle/index.test.js', ['io-gui', 'io-sliders', 'packages/io-colors/build/index.js']),
];

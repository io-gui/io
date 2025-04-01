import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-sliders/build/index.js', 'packages/io-sliders/bundle/index.js', ['io-gui', 'io-inputs']),
  makeBundleTarget('packages/io-sliders/build/index.test.js', 'packages/io-sliders/bundle/index.test.js', ['io-gui', 'io-inputs', 'packages/io-sliders/build/index.js']),
];

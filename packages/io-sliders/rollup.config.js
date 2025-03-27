import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-sliders/build/index.js', 'packages/io-sliders/bundle/index.js', ['io-gui']),
  makeBundleTarget('packages/io-sliders/build/index.test.js', 'packages/io-sliders/bundle/index.test.js', ['io-gui', 'packages/io-sliders/build/index.js']),
];

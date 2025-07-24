import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-gui/build/index.js', 'packages/io-gui/bundle/index.js'),
  makeBundleTarget('packages/io-gui/build/index.test.js', 'packages/io-gui/bundle/index.test.js'),
];

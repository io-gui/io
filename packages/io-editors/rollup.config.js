import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-editors/build/index.js', 'packages/io-editors/bundle/index.js', ['io-gui', 'io-menus', 'io-colors', 'io-navigation', 'io-inputs', 'io-sliders']),
  makeBundleTarget('packages/io-editors/build/index.test.js', 'packages/io-editors/bundle/index.test.js', ['packages/io-editors/build/index.js']),
];

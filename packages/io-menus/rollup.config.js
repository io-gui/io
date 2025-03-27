import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-menus/build/index.js', 'packages/io-menus/bundle/index.js', ['io-gui']),
  makeBundleTarget('packages/io-menus/build/index.test.js', 'packages/io-menus/bundle/index.test.js', ['io-gui', 'packages/io-menus/build/index.js']),
];

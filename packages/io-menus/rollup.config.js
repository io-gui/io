import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-menus/build/index.js', 'packages/io-menus/bundle/index.js', ['io-gui', 'io-inputs', 'io-icons']),
  makeBundleTarget('packages/io-menus/build/index.test.js', 'packages/io-menus/bundle/index.test.js', ['io-gui', 'io-inputs', 'io-icons', 'packages/io-menus/build/index.js']),
];

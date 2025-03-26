import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-menus/build/io-menus.js', 'packages/io-menus/bundle/io-menus.js', ['io-gui']),
];

import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-navigation/build/index.js', 'packages/io-navigation/bundle/index.js', ['io-gui', 'io-markdown', 'io-menus']),
];

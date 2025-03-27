import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-navigator/build/index.js', 'packages/io-navigator/bundle/index.js', ['io-gui', 'io-markdown', 'io-menus']),
];

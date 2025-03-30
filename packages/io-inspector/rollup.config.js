import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-inspector/build/index.js', 'packages/io-inspector/bundle/index.js', ['io-gui', 'io-menus']),
];

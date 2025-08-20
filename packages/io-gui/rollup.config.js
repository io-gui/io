import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-gui/build/index.js', 'packages/io-gui/bundle/index.js', false),
];

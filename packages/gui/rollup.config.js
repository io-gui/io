import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/gui/build/index.js', 'packages/gui/bundle/index.js', false),
];

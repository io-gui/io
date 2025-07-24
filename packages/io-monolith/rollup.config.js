import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-monolith/build/index.js', 'packages/io-monolith/bundle/index.js', false),
];

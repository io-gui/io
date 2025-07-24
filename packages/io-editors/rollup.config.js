import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-editors/build/index.js', 'packages/io-editors/bundle/index.js'),
  makeBundleTarget('packages/io-editors/build/index.test.js', 'packages/io-editors/bundle/index.test.js'),
];

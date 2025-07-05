import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-layout/build/index.js', 'packages/io-layout/bundle/index.js'),
  makeBundleTarget('packages/io-layout/build/index.test.js', 'packages/io-layout/bundle/index.test.js'),
];

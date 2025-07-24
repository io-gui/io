import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-icons/build/index.js', 'packages/io-icons/bundle/index.js'),
  makeBundleTarget('packages/io-icons/build/index.test.js', 'packages/io-icons/bundle/index.test.js'),
];

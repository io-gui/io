import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-markdown/build/index.js', 'packages/io-markdown/bundle/index.js'),
  makeBundleTarget('packages/io-markdown/build/index.test.js', 'packages/io-markdown/bundle/index.test.js'),
];

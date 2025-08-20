import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-colors/build/index.js', 'packages/io-colors/bundle/index.js'),
  makeBundleTarget('packages/io-colors/build/demos/IoColorsDemo.js', 'packages/io-colors/bundle/demos/IoColorsDemo.js'),
  makeBundleTarget('packages/io-colors/build/index.test.js', 'packages/io-colors/bundle/index.test.js'),
];

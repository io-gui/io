import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-navigation/build/index.js', 'packages/io-navigation/bundle/index.js'),
  makeBundleTarget('packages/io-navigation/build/demos/IoNavigationDemo.js', 'packages/io-navigation/bundle/demos/IoNavigationDemo.js'),
  makeBundleTarget('packages/io-navigation/build/index.test.js', 'packages/io-navigation/bundle/index.test.js'),
];

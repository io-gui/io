import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-menus/build/index.js', 'packages/io-menus/bundle/index.js'),
  makeBundleTarget('packages/io-menus/build/demos/IoMenusDemo.js', 'packages/io-menus/bundle/demos/IoMenusDemo.js'),
  makeBundleTarget('packages/io-menus/build/index.test.js', 'packages/io-menus/bundle/index.test.js'),
];

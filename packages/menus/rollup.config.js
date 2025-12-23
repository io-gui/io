import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/menus/build/index.js', 'packages/menus/bundle/index.js'),
  makeBundleTarget('packages/menus/build/demos/IoMenusDemo.js', 'packages/menus/bundle/demos/IoMenusDemo.js'),
  makeBundleTarget('packages/menus/build/index.test.js', 'packages/menus/bundle/index.test.js'),
];

import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/navigation/build/index.js', 'packages/navigation/bundle/index.js'),
  makeBundleTarget('packages/navigation/build/demos/IoNavigationDemo.js', 'packages/navigation/bundle/demos/IoNavigationDemo.js'),
  makeBundleTarget('packages/navigation/build/index.test.js', 'packages/navigation/bundle/index.test.js'),
];

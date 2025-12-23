import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/icons/build/index.js', 'packages/icons/bundle/index.js'),
  makeBundleTarget('packages/icons/build/demos/IoIconsDemo.js', 'packages/icons/bundle/demos/IoIconsDemo.js'),
  makeBundleTarget('packages/icons/build/index.test.js', 'packages/icons/bundle/index.test.js'),
];

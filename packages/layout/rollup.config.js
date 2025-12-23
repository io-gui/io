import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/layout/build/index.js', 'packages/layout/bundle/index.js'),
  makeBundleTarget('packages/layout/build/demos/IoLayoutDemo.js', 'packages/layout/bundle/demos/IoLayoutDemo.js'),
  makeBundleTarget('packages/layout/build/index.test.js', 'packages/layout/bundle/index.test.js'),
];

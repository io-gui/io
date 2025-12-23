import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/colors/build/index.js', 'packages/colors/bundle/index.js'),
  makeBundleTarget('packages/colors/build/demos/IoColorsDemo.js', 'packages/colors/bundle/demos/IoColorsDemo.js'),
  makeBundleTarget('packages/colors/build/index.test.js', 'packages/colors/bundle/index.test.js'),
];

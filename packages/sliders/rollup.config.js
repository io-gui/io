import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/sliders/build/index.js', 'packages/sliders/bundle/index.js'),
  makeBundleTarget('packages/sliders/build/demos/IoSlidersDemo.js', 'packages/sliders/bundle/demos/IoSlidersDemo.js'),
  makeBundleTarget('packages/sliders/build/index.test.js', 'packages/sliders/bundle/index.test.js'),
];

import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/inputs/build/index.js', 'packages/inputs/bundle/index.js'),
  makeBundleTarget('packages/inputs/build/demos/IoInputsDemo.js', 'packages/inputs/bundle/demos/IoInputsDemo.js'),
  makeBundleTarget('packages/inputs/build/index.test.js', 'packages/inputs/bundle/index.test.js'),
];

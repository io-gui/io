import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/editors/build/index.js', 'packages/editors/bundle/index.js'),
  makeBundleTarget('packages/editors/build/demos/IoEditorsDemo.js', 'packages/editors/bundle/demos/IoEditorsDemo.js'),
  makeBundleTarget('packages/editors/build/index.test.js', 'packages/editors/bundle/index.test.js'),
];

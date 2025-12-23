import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/markdown/build/index.js', 'packages/markdown/bundle/index.js'),
  makeBundleTarget('packages/markdown/build/demos/IoMarkdownDemo.js', 'packages/markdown/bundle/demos/IoMarkdownDemo.js'),
  makeBundleTarget('packages/markdown/build/index.test.js', 'packages/markdown/bundle/index.test.js'),
];

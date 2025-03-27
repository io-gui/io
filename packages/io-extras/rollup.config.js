import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-extras/build/index.js', 'packages/io-extras/bundle/index.js', ['io-gui', 'io-markdown']),
];

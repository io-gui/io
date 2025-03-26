import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-extras/build/io-extras.js', 'packages/io-extras/bundle/io-extras.js', ['io-gui', 'io-markdown']),
];

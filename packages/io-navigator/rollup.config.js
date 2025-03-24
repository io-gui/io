import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-navigator/build/io-navigator.js', 'packages/io-navigator/bundle/io-navigator.js', ['io-gui', 'io-markdown']),
];

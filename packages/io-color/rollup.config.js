import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-color/build/io-color.js', 'packages/io-color/bundle/io-color.js', ['io-gui']),
];

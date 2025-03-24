import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-icons/build/io-icons.js', 'packages/io-icons/bundle/io-icons.js', ['io-gui']),
];

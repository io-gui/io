import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-icons/build/index.js', 'packages/io-icons/bundle/index.js', ['io-gui']),
  makeBundleTarget('packages/io-icons/build/index.test.js', 'packages/io-icons/bundle/index.test.js', ['io-gui', 'packages/io-icons/build/index.js']),
];

import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-inputs/build/index.js', 'packages/io-inputs/bundle/index.js', ['io-gui', 'io-icons']),
  makeBundleTarget('packages/io-inputs/build/index.test.js', 'packages/io-inputs/bundle/index.test.js', ['io-gui', 'io-icons', 'packages/io-inputs/build/index.js']),
];

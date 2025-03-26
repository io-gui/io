import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-iconset/build/index.js', 'packages/io-iconset/bundle/index.js', ['io-gui']),
  makeBundleTarget('packages/io-iconset/build/index.test.js', 'packages/io-iconset/bundle/index.test.js', ['io-gui', 'packages/io-iconset/build/index.js']),
];

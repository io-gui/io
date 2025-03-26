import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-inspector/build/io-inspector.js', 'packages/io-inspector/bundle/io-inspector.js', ['io-gui']),
];

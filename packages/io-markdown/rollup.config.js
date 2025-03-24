import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-markdown/build/io-markdown.js', 'packages/io-markdown/bundle/io-markdown.js', ['io-gui']),
];

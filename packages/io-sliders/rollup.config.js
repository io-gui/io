import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-sliders/build/io-sliders.js', 'packages/io-sliders/bundle/io-sliders.js', ['io-gui']),
];

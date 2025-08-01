import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-gui/build/index.js', 'packages/io-gui/bundle/index.js'),
  makeBundleTarget('packages/io-gui/build/demos/IoChangeVisualization.js', 'packages/io-gui/bundle/demos/IoChangeVisualization.js'),
  makeBundleTarget('packages/io-gui/build/demos/IoElementInspectorDemo.js', 'packages/io-gui/bundle/demos/IoElementInspectorDemo.js'),
  makeBundleTarget('packages/io-gui/build/demos/IoStyleContainer.js', 'packages/io-gui/bundle/demos/IoStyleContainer.js'),
  makeBundleTarget('packages/io-gui/build/demos/IoThemeEditor.js', 'packages/io-gui/bundle/demos/IoThemeEditor.js'),
  makeBundleTarget('packages/io-gui/build/index.test.js', 'packages/io-gui/bundle/index.test.js'),
];

import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/io-core/build/index.js', 'packages/io-core/bundle/index.js'),
  makeBundleTarget('packages/io-core/build/demos/IoChangeVisualization.js', 'packages/io-core/bundle/demos/IoChangeVisualization.js'),
  makeBundleTarget('packages/io-core/build/demos/IoElementInspectorDemo.js', 'packages/io-core/bundle/demos/IoElementInspectorDemo.js'),
  makeBundleTarget('packages/io-core/build/demos/IoStyleContainer.js', 'packages/io-core/bundle/demos/IoStyleContainer.js'),
  makeBundleTarget('packages/io-core/build/demos/IoThemeEditor.js', 'packages/io-core/bundle/demos/IoThemeEditor.js'),
  makeBundleTarget('packages/io-core/build/demos/todomvc/TodoApp.js', 'packages/io-core/bundle/demos/todomvc/TodoApp.js'),
  makeBundleTarget('packages/io-core/build/index.test.js', 'packages/io-core/bundle/index.test.js'),
];

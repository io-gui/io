import { makeBundleTarget } from '../../rollup.config.js';

export default [
  makeBundleTarget('packages/core/build/index.js', 'packages/core/bundle/index.js'),
  makeBundleTarget('packages/core/build/demos/IoChangeVisualization.js', 'packages/core/bundle/demos/IoChangeVisualization.js'),
  makeBundleTarget('packages/core/build/demos/IoElementInspectorDemo.js', 'packages/core/bundle/demos/IoElementInspectorDemo.js'),
  makeBundleTarget('packages/core/build/demos/IoStyleContainer.js', 'packages/core/bundle/demos/IoStyleContainer.js'),
  makeBundleTarget('packages/core/build/demos/IoThemeEditor.js', 'packages/core/bundle/demos/IoThemeEditor.js'),
  makeBundleTarget('packages/core/build/demos/todomvc/TodoApp.js', 'packages/core/bundle/demos/todomvc/TodoApp.js'),
  makeBundleTarget('packages/core/build/index.test.js', 'packages/core/bundle/index.test.js'),
];

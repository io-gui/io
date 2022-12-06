import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import { terser } from "rollup-plugin-terser";

function makeBundleTarget(src, target, externals = [], debug) {

  externals.forEach(function(part, index) {
    externals[index] = path.resolve(externals[index]);
  });

  return {
    input: src,
    plugins: [
      nodeResolve(),
      strip({
        functions: [],
        labels: debug ? [] : ['debug']
      }),
      terser({
        keep_classnames: true,
        keep_fnames: true,
      })
    ],
    treeshake: true,
    inlineDynamicImports: true,
    output: [{
      format: 'es',
      file: target,
      indent: '  '
    }],
    external: externals,
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
}

export default [
  makeBundleTarget('build/iogui.js', 'bundle/iogui.js'),
  makeBundleTarget('build/iogui.js', 'bundle/iogui.debug.js', [], true),
  makeBundleTarget('build/iogui.test.js', 'bundle/iogui.test.js', ['build/iogui.js'], true),
];

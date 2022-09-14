import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import { terser } from "rollup-plugin-terser";

const externals = [];

function makeBundleTarget(src, target) {
  const _externals = [...externals];
  externals.push(path.resolve(src));
  return {
    input: src,
    plugins: [
      nodeResolve(),
      strip({
        functions: [],
        labels: ['debug']
      }),
      terser({
        keep_classnames: true,
        keep_fnames: true,
      })
    ],
    treeshake: false,
    inlineDynamicImports: true,
    output: [{
      format: 'es',
      file: target,
      indent: '  '
    }],
    external: _externals,
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
}

export default [
  makeBundleTarget('build/iogui.js', 'bundle/iogui.js'),
  makeBundleTarget('build/iogui.test.js', 'bundle/iogui.test.js'),
];

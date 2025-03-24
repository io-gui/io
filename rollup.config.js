import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from "@rollup/plugin-terser";

export function makeBundleTarget(src, target, externals = [], debug) {

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
        compress: {
          keep_infinity: true,
        }
      })
    ],
    treeshake: true,
    output: [{
      inlineDynamicImports: true,
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
  makeBundleTarget('build/io-gui.js', 'bundle/io-gui.js', []),
  makeBundleTarget('build/io-gui.js', 'bundle/io-gui.debug.js', [], true),
  makeBundleTarget('build/io-gui.test.js', 'bundle/io-gui.test.js', ['build/io-gui.js'], true),
];

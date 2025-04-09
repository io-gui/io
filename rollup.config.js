import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import terser from '@rollup/plugin-terser';

// const externals = [];
const externals = ['io-gui', 'io-markdown', 'io-menus', 'io-inputs', 'io-icons', 'io-colors', 'io-extras', 'io-editors', 'io-sliders'];

export function makeBundleTarget(src, target) {

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
    external: _externals,
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
}

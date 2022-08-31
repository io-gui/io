import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import strip from '@rollup/plugin-strip';
import { terser } from "rollup-plugin-terser";

function stripLines() {
  let regexes = [
    /\/\*\scss\s\*\/([\s\S]*?)`\;/gm,
    /\/\*\sglsl\s\*\/([\s\S]*?)`\;/gm,
    /<svg>([\s\S]*?)<\/svg>/gm,
  ];
  return {
    transform( code ) {
      let transformedCode = code;
      for (let j = 0; j < regexes.length; j++) {
        let regex = regexes[j];
        if ( regex.test( code ) === true ) {
          let match = code.match(regex);
          for (let i = 0; i < match.length; i++) {
            transformedCode = transformedCode.replace(match[i], match[i].replace((/ {2}|\r\n|\n|\r/gm), ''));
          }
        }
      }
      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

const externals = [];

function makeBundleTarget(src, target) {
  const _externals = [...externals];
  externals.push(path.resolve(src));
  return {
    input: src,
    plugins: [
      nodeResolve({
        resolveOnly: ['marked']
      }),
      // stripLines(),
      strip({
        functions: [],
        labels: ['debug']
      }),
      terser({
        keep_classnames: true,
        keep_fnames: true,
      })
    ],
    inlineDynamicImports: true,
    output: [{
      format: 'es',
      // sourcemap: true,
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

import path from 'path';
import strip from '@rollup/plugin-strip';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
import { uglify } from "rollup-plugin-uglify";

function html() {
  return {
    transform( code ) {
      let transformedCode = code;
      let regex = /<style>([\s\S]*?)<\/style>/gm;
      if ( regex.test( code ) === true ) {
        let match = code.match(regex);
        for (let i = 0; i < match.length; i++) {
          transformedCode = transformedCode.replace(match[i], match[i].replace((/ {2}|\r\n|\n|\r/gm), ''));
        }
      }
      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

function svg() {
  return {
    transform( code ) {
      let transformedCode = code;
      let regex = /<svg>([\s\S]*?)<\/svg>/gm;
      if ( regex.test( code ) === true ) {
        let match = code.match(regex);
        for (let i = 0; i < match.length; i++) {
          transformedCode = transformedCode.replace(match[i], match[i].replace((/ {2}|\r\n|\n|\r/gm), ''));
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
  const externalsCopy = [...externals];
  externals.push(path.resolve(src));
  return {
    input: src,
    plugins: [
      html(),
      svg(),
      // nodeResolve(),
      strip({
        debugger: false,
        labels: ['debug']
      }),
      uglify()
    ],
    inlineDynamicImports: true,
    output: [{
      format: 'esm',
      file: target,
      indent: '  '
    }],
    external: externalsCopy,
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
}

export default [
  makeBundleTarget('build/iogui.js', 'bundle/iogui.js'),
  makeBundleTarget('build/iogui.test.js', 'bundle/iogui.test.js'),
  makeBundleTarget('build/iogui.elements.js', 'bundle/iogui.elements.js'),
  makeBundleTarget('build/iogui.elements.test.js', 'bundle/iogui.elements.test.js'),
];

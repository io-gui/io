import path from 'path';
import strip from '@rollup/plugin-strip';

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

function makeTarget(src, target) {
  externals.push(path.resolve(src));
  return {
    input: src,
    plugins: [
      html(),
      svg(),
      strip({
        debugger: false,
        labels: ['debug']
      })
    ],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: target,
        indent: '  '
      }
    ],
    external: externals,
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
}

export default [
  makeTarget('src/iogui.js', 'build/iogui.js'),
  makeTarget('src/iogui.js', 'build/iogui.js'),
  makeTarget('src/iogui.test.js', 'build/iogui.test.js'),
];

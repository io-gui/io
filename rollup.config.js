import path from 'path';
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
  const externalsCopy = [...externals];
  externals.push(path.resolve(src));
  return {
    input: src,
    plugins: [
      stripLines(),
      strip({
        debugger: false,
        labels: ['debug']
      }),
      terser()
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

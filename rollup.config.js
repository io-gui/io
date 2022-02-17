import path from 'path';
// import strip from '@rollup/plugin-strip';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

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

function makeBuildTarget(src) {
  const externalsCopy = [...externals];
  externals.push(path.resolve(src));
  return {
    input: src,
    plugins: [
      // strip({
      //   debugger: false,
      //   labels: ['debug']
      // }),
      typescript({ tsconfig: './tsconfig.json', module: "ESNext" }),
      replace({
        "iogui.ts": "iogui.js"
      })
    ],
    inlineDynamicImports: true,
    output: [{
      sourcemap: true,
      format: 'esm',
      dir: 'build',
      indent: '  '
    }],
    external: externalsCopy,
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
}

const externals2 = [];
function makeBundleTarget(src, target) {
  // const externalsCopy = [...externals2];
  // externals2.push(path.resolve(src));
  return {
    input: src,
    plugins: [
      html(),
      svg(),
      nodeResolve(),
    ],
    inlineDynamicImports: true,
    output: [{
      format: 'esm',
      file: target.replace('.ts', '.js'),
      indent: '  '
    }],
    // external: externalsCopy,
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  };
}

export default [
  makeBuildTarget('src/iogui.ts'),
  makeBuildTarget('src/iogui.test.ts'),
  // makeBundleTarget('build/iogui.js', 'bundle/iogui.js'),
  // makeBundleTarget('build/iogui.test.js', 'bundle/iogui.test.js'),
];

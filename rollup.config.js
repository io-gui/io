import path from 'path';

function html() {
  return {
    transform( code, id ) {
      let transformedCode = code;
      let regex = /<style>([\s\S]*?)<\/style>/gm;
      if ( regex.test( code ) === true ) {
        let match = code.match(regex);
        for (var i = 0; i < match.length; i++) {
          transformedCode = transformedCode.replace(match[i], match[i].replace((/  |\r\n|\n|\r/gm), ""));
        }
      };
      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

function svg() {
  return {
    transform( code, id ) {
      let transformedCode = code;
      let regex = /<svg>([\s\S]*?)<\/svg>/gm;
      if ( regex.test( code ) === true ) {
        let match = code.match(regex);
        for (var i = 0; i < match.length; i++) {
          transformedCode = transformedCode.replace(match[i], match[i].replace((/  |\r\n|\n|\r/gm), ""));
        }
      };
      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

const externals = ['../three.js/build/three.module.js'];

function makeTarget(src, target) {
  externals.push(path.resolve(src));
  return {
    input: src,
    plugins: [html(), svg()],
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
  }
}

export default [
  makeTarget('src/io.js', 'build/io.js'),
  makeTarget('src/io-core.js', 'build/io-core.js'),
  makeTarget('src/io-extras.js', 'build/io-extras.js'),
  makeTarget('src/io-three.js', 'build/io-three.js'),
  makeTarget('src/io-tests.js', 'build/io-tests.js'),
];

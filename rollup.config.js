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

const externals = [];

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
  {
    input: 'src/io-all.js',
    plugins: [html(), svg()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-all.js',
        indent: '  '
      }
    ],
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  },
  makeTarget('src/io.js', 'dist/io.js'),
  makeTarget('src/io-core.js', 'dist/io-core.js'),
  makeTarget('src/io-extras.js', 'dist/io-extras.js'),
  makeTarget('src/io-layout.js', 'dist/io-layout.js'),
  makeTarget('src/io-math.js', 'dist/io-math.js'),
  makeTarget('src/io-color.js', 'dist/io-color.js'),
  makeTarget('src/io-menu.js', 'dist/io-menu.js'),
  makeTarget('src/io-object.js', 'dist/io-object.js'),
  makeTarget('src/io-demo.js', 'dist/io-demo.js'),
  makeTarget('src/io-notify.js', 'dist/io-notify.js'),
  makeTarget('src/io-tests.js', 'dist/io-tests.js'),
];

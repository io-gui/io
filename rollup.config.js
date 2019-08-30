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


export default [
  {
    input: 'src/io.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io.js',
        indent: '  '
      }
    ],
  },
  {
    input: 'src/io-core.js',
    plugins: [html(), svg()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-core.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js') ],
  },
  {
    input: 'src/io-extras.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-extras.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-core.js') ],
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  },
  {
    input: 'src/io-layout.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-layout.js',
        indent: '  '
      }
    ],
    // TODO: remove menu dependency
    external: [ path.resolve('src/io.js'), path.resolve('src/io-core.js') ],
  },
  {
    input: 'src/io-math.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-math.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-core.js') ],
  },
  {
    input: 'src/io-color.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-color.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-core.js') ],
  },
  {
    input: 'src/io-menu.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-menu.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-core.js') ],
  },
  {
    input: 'src/io-object.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-object.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-core.js') ],
  },
  {
    input: 'src/demo/io-demo.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-demo.js',
        indent: '  '
      }
    ],
    external: [
      path.resolve('src/io.js'),
      path.resolve('src/io-core.js'),
      path.resolve('src/io-color.js'),
      path.resolve('src/io-extras.js'),
      path.resolve('src/io-layout.js'),
      path.resolve('src/io-math.js'),
      path.resolve('src/io-menu.js'),
      path.resolve('src/io-object.js'),
    ],
  },
  // {
  //   input: 'tests/io-tests.js',
  //   plugins: [html()],
  //   inlineDynamicImports: true,
  //   output: [
  //     {
  //       format: 'es',
  //       file: 'dist/io-tests.js',
  //       indent: '  '
  //     }
  //   ],
  //   external: [
  //     path.resolve('src/io.js'),
  //     path.resolve('dist/io-core.js'),
  //     path.resolve('dist/io-color.js'),
  //     path.resolve('dist/io-extras.js'),
  //     path.resolve('dist/io-layout.js'),
  //     path.resolve('dist/io-math.js'),
  //     path.resolve('dist/io-menu.js'),
  //     path.resolve('dist/io-object.js'),
  //   ],
  // },
];

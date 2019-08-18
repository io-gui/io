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
    input: 'src/io-elements-core.js',
    plugins: [html(), svg()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements-core.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js') ],
  },
  {
    input: 'src/io-elements-extras.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements-extras.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements-core.js') ],
    onwarn: (warning, warn) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      warn(warning);
    }
  },
  {
    input: 'src/io-elements-layout.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements-layout.js',
        indent: '  '
      }
    ],
    // TODO: remove menu dependency
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements-core.js'), path.resolve('src/io-elements-menu.js') ],
  },
  {
    input: 'src/io-elements-math.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements-math.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements-core.js') ],
  },
  {
    input: 'src/io-elements-color.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements-color.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements-core.js') ],
  },
  {
    input: 'src/io-elements-menu.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements-menu.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements-core.js') ],
  },
  {
    input: 'src/io-elements-object.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements-object.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements-core.js') ],
  },
];

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
    input: 'src/io-elements.js',
    plugins: [html()],
    inlineDynamicImports: true,
    output: [
      {
        format: 'es',
        file: 'dist/io-elements.js',
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
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements.js') ],
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
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements.js') ],
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
    external: [ path.resolve('src/io.js'), path.resolve('src/io-elements.js') ],
  },
];

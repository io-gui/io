import path from 'path';

function html() {
  return {
    transform( code, id ) {
      let transformedCode = code;
      let regex = /html`(([\s\S])*)`/;
      if ( regex.test( code ) === true ) {
        let match = code.match(regex);
        transformedCode = code.replace(match[0], match[0].replace((/  |\r\n|\n|\r/gm),""))
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
    output: [
      {
        format: 'es',
        file: 'build/io.js',
        indent: '  '
      }
    ],
    plugins: [html()]
  },
  {
    input: 'src/io-lite.js',
    output: [
      {
        format: 'es',
        file: 'build/io-lite.js',
        indent: '  '
      }
    ]
  },
  {
    input: 'src/io-core.js',
    output: [
      {
        format: 'es',
        file: 'build/io-core.js',
        indent: '  '
      }
    ]
  },
  {
    input: 'src/io-elements.js',
    output: [
      {
        format: 'es',
        file: 'build/io-elements.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('./src/io-core.js') ],
    plugins: [html()]
  }
];

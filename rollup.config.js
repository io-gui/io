import path from 'path';

function html() {
  return {
    transform( code, id ) {
      var transformedCode = code;
      var regex = /html`(([\s\S])*)`/;
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
    input: 'src/core.js',
    plugins: [
      html()
    ],
    output: [
      {
        format: 'es',
        file: 'build/core.js',
        indent: '  '
      }
    ]
  },
  {
    input: 'src/elements.js',
    plugins: [
      html()
    ],
    output: [
      {
        format: 'es',
        file: 'build/elements.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/core.js'), path.resolve('src/mixins.js') ]
  },
  {
    input: 'src/mixins.js',
    plugins: [
      html()
    ],
    output: [
      {
        format: 'es',
        file: 'build/mixins.js',
        indent: '  '
      }
    ],
    external: [ path.resolve('src/core.js'), path.resolve('src/elements.js') ]
  }
];

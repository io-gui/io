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
    plugins: [html()],
    output: [
      {
        format: 'es',
        file: 'build/io.js',
        indent: '  '
      }
    ]
  },
  {
    input: 'src/classes/lite.js',
    output: [
      {
        format: 'es',
        file: 'build/io-lite.js',
        indent: '  '
      }
    ]
  }
];

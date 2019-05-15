function html() {
  return {
    transform( code, id ) {
      let transformedCode = code;
      let regex = /<style>((.|\n|\t|\r)*?)<\/style>/gm;
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
    output: [
      {
        format: 'es',
        file: 'build/io.js',
        indent: '  '
      }
    ],
  },
  {
    input: 'src/io-core.js',
    plugins: [html()],
    output: [
      {
        format: 'es',
        file: 'build/io-core.js',
        indent: '  '
      }
    ],
  },
];

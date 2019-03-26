function html() {
  return {
    transform( code, id ) {
      let transformedCode = code;
      let regex = /html`<style>(([\s\S])*)<\/style>`/;
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

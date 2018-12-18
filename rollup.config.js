export default [
  {
    input: 'src/io.js',
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

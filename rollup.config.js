export default [
  {
    input: 'src/io.js',
    output: [
      {
        format: 'es',
        file: 'src/io.js',
        indent: '  '
      }
    ]
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
];

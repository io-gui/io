export default {
	input: 'src/io/io.js',
	// sourceMap: true,
	output: [
		{
			format: 'umd',
			name: 'THREE',
			file: 'build/io.umd.js',
			indent: '  '
		},
		{
			format: 'es',
			file: 'build/io.js',
			indent: '  '
		}
	]
};

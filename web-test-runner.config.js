import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      target: 'es2022'
    }),
    importMapsPlugin(),
  ],
};
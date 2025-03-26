import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';
import { wdsPluginFixImportMapsModules } from './web-dev-server.config.js';

export default {
  nodeResolve: true,
  plugins: [
    esbuildPlugin({
      ts: true,
      target: 'esnext',
      tsconfig: './tsconfig.json',
    }),
    importMapsPlugin(),
    wdsPluginFixImportMapsModules(),
  ],
};
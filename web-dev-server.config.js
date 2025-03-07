import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

export default {
  nodeResolve: true,
  plugins: [
    esbuildPlugin({ts: true}),
    importMapsPlugin()
  ]
}

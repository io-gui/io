import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

// put the modules which will be resolved by Import Maps in runtime
const importMapsModules = {
  'io-gui': '/build/iogui.js?wds-import-map=0',
};

/** @returns {import('@web/dev-server-core').Plugin} */
export function wdsPluginFixImportMapsModules() {
  return {
    name: 'wds-plugin-fix-import-maps-modules',
    async resolveImport({ source }) {
      if (Object.keys(importMapsModules).includes(source)) {
        return importMapsModules[source];
      }
      return undefined;
    },
  };
}

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
  ]
}

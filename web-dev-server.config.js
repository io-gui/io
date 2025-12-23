import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

const importMapsModules = {
  'io-core': '/packages/core/build/index.js?wds-import-map=0',
  'io-colors': '/packages/colors/build/index.js?wds-import-map=0',
  'io-editors': '/packages/editors/build/index.js?wds-import-map=0',
  'io-icons': '/packages/icons/build/index.js?wds-import-map=0',
  'io-inputs': '/packages/inputs/build/index.js?wds-import-map=0',
  'io-layout': '/packages/layout/build/index.js?wds-import-map=0',
  'io-markdown': '/packages/markdown/build/index.js?wds-import-map=0',
  'io-menus': '/packages/menus/build/index.js?wds-import-map=0',
  'io-navigation': '/packages/navigation/build/index.js?wds-import-map=0',
  'io-sliders': '/packages/sliders/build/index.js?wds-import-map=0',
};

export function wdsPluginFixImportMapsModules() {
  return {
    name: 'wds-plugin-fix-import-maps-modules',
    async resolveImport({ source }) {
      console.log('resolveImport', source);
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
      target: 'esnext',
    }),
    importMapsPlugin(),
    wdsPluginFixImportMapsModules(),
  ]
}

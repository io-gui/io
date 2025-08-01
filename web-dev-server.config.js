import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

const importMapsModules = {
  'io-gui': '/packages/io-gui/build/index.js?wds-import-map=0',
  'io-colors': '/packages/io-colors/build/index.js?wds-import-map=0',
  'io-editors': '/packages/io-editors/build/index.js?wds-import-map=0',
  'io-icons': '/packages/io-icons/build/index.js?wds-import-map=0',
  'io-inputs': '/packages/io-inputs/build/index.js?wds-import-map=0',
  'io-layout': '/packages/io-layout/build/index.js?wds-import-map=0',
  'io-markdown': '/packages/io-markdown/build/index.js?wds-import-map=0',
  'io-menus': '/packages/io-menus/build/index.js?wds-import-map=0',
  'io-navigation': '/packages/io-navigation/build/index.js?wds-import-map=0',
  'io-sliders': '/packages/io-sliders/build/index.js?wds-import-map=0',
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

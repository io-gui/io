import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

const importMapsModules = {
  'io-gui': '/packages/io-gui/build/index.js?wds-import-map=0',
  'io-colors': '/packages/io-colors/build/index.js?wds-import-map=0',
  'io-extras': '/packages/io-extras/build/index.js?wds-import-map=0',
  'io-iconset': '/packages/io-iconset/build/index.js?wds-import-map=0',
  'io-inputs': '/packages/io-inputs/build/index.js?wds-import-map=0',
  'io-inspector': '/packages/io-inspector/build/index.js?wds-import-map=0',
  'io-markdown': '/packages/io-markdown/build/index.js?wds-import-map=0',
  'io-menus': '/packages/io-menus/build/index.js?wds-import-map=0',
  'io-navigator': '/packages/io-navigator/build/index.js?wds-import-map=0',
  'io-sliders': '/packages/io-sliders/build/index.js?wds-import-map=0',
};

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
      target: 'esnext',
    }),
    importMapsPlugin(),
    wdsPluginFixImportMapsModules(),
  ]
}

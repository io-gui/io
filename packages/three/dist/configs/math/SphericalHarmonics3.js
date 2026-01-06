import { registerEditorConfig, ioPropertyEditor } from '@io-gui/editors';
import { SphericalHarmonics3 } from 'three/webgpu';
registerEditorConfig(SphericalHarmonics3, [
    ['coefficients', ioPropertyEditor({ labeled: false })],
]);
registerEditorConfig(Object, [
    [SphericalHarmonics3, ioPropertyEditor({ labeled: false })],
]);
//# sourceMappingURL=SphericalHarmonics3.js.map
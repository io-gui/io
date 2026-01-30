import { registerEditorConfig, ioPropertyEditor, ioObject } from '@io-gui/editors';
import { SphericalHarmonics3, Vector3 } from 'three/webgpu';
import { ioVector3 } from '../../elements/math/IoVector3.js';
registerEditorConfig(SphericalHarmonics3, [
    ['coefficients', ioPropertyEditor({ labelWidth: '18px', config: [
                [Vector3, ioVector3({ step: 0.001 })],
            ] })],
]);
registerEditorConfig(Object, [
    [SphericalHarmonics3, ioObject({ labeled: false })],
]);
//# sourceMappingURL=SphericalHarmonics3.js.map
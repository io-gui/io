import { registerEditorGroups } from '@io-gui/editors';
import { Mesh } from 'three/webgpu';
registerEditorGroups(Mesh, {
    Rendering: ['count'],
    Morphing: ['morphTargetInfluences', 'morphTargetDictionary'],
});
//# sourceMappingURL=Mesh.js.map
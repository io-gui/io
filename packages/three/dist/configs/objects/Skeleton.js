import { registerEditorGroups } from '@io-gui/editors';
import { Skeleton } from 'three/webgpu';
registerEditorGroups(Skeleton, {
    Main: ['bones', 'boneInverses', 'boneMatrices', 'previousBoneMatrices', 'boneTexture'],
});
//# sourceMappingURL=Skeleton.js.map
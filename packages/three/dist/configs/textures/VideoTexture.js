import { registerEditorGroups } from '@io-gui/editors';
import { VideoTexture } from 'three/webgpu';
registerEditorGroups(VideoTexture, {
    Hidden: ['_requestVideoFrameCallbackId'],
});
//# sourceMappingURL=VideoTexture.js.map
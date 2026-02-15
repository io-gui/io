import { MeshBasicNodeMaterial, type Texture } from 'three/webgpu';
export type DebugStateTextureIndex = 0 | 1 | 2;
export declare class DebugStateMaterial extends MeshBasicNodeMaterial {
    private _padsTexture;
    private _layer0Texture;
    private _layer1Texture;
    readonly textureIndex: import("three/webgpu").UniformNode<number>;
    constructor(padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture);
    setTextures(padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture): void;
    setTextureIndex(index: DebugStateTextureIndex): void;
    private _rebuildColorNode;
}
//# sourceMappingURL=DebugStateMaterial.d.ts.map
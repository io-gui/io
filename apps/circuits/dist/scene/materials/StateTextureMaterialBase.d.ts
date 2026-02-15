import { InstancedBufferAttribute, MeshBasicNodeMaterial, type Texture } from 'three/webgpu';
export type StateTextureIndex = 0 | 1 | 2;
export declare class StateTextureMaterialBase extends MeshBasicNodeMaterial {
    private _padsTexture;
    private _layer0Texture;
    private _layer1Texture;
    private _instanceUVAttribute;
    readonly textureIndex: import("three/webgpu").UniformNode<number>;
    readonly brightness: import("three/webgpu").UniformNode<number>;
    constructor(padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture, textureIndex: StateTextureIndex, brightness?: number);
    setTextures(padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture): void;
    setInstanceUVAttribute(instanceUVAttribute: InstancedBufferAttribute): void;
    setTextureIndex(index: StateTextureIndex): void;
    private _rebuildColorNode;
}
//# sourceMappingURL=StateTextureMaterialBase.d.ts.map
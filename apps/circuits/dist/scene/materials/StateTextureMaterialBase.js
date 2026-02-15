import { InstancedBufferAttribute, MeshBasicNodeMaterial } from 'three/webgpu';
import { instancedBufferAttribute, texture, uniform, vec4 } from 'three/tsl';
export class StateTextureMaterialBase extends MeshBasicNodeMaterial {
    _padsTexture;
    _layer0Texture;
    _layer1Texture;
    _instanceUVAttribute;
    textureIndex = uniform(0);
    brightness = uniform(1);
    constructor(padsTexture, layer0Texture, layer1Texture, textureIndex, brightness = 1) {
        super({ toneMapped: false, transparent: false });
        this.vertexColors = false;
        this._padsTexture = padsTexture;
        this._layer0Texture = layer0Texture;
        this._layer1Texture = layer1Texture;
        this._instanceUVAttribute = new InstancedBufferAttribute(new Float32Array([0.5, 0.5, 0]), 3);
        this.textureIndex.value = textureIndex;
        this.brightness.value = brightness;
        this._rebuildColorNode();
    }
    setTextures(padsTexture, layer0Texture, layer1Texture) {
        const changed = this._padsTexture !== padsTexture
            || this._layer0Texture !== layer0Texture
            || this._layer1Texture !== layer1Texture;
        if (!changed)
            return;
        this._padsTexture = padsTexture;
        this._layer0Texture = layer0Texture;
        this._layer1Texture = layer1Texture;
        this._rebuildColorNode();
    }
    setInstanceUVAttribute(instanceUVAttribute) {
        if (this._instanceUVAttribute === instanceUVAttribute)
            return;
        this._instanceUVAttribute = instanceUVAttribute;
        this._rebuildColorNode();
    }
    setTextureIndex(index) {
        this.textureIndex.value = index;
    }
    _rebuildColorNode() {
        const instanceUV = instancedBufferAttribute(this._instanceUVAttribute).xy;
        const padsNode = texture(this._padsTexture, instanceUV);
        const layer0Node = texture(this._layer0Texture, instanceUV);
        const layer1Node = texture(this._layer1Texture, instanceUV);
        const selector = this.textureIndex.clamp(0, 2);
        const padsWeight = selector.sub(0).abs().oneMinus().clamp();
        const layer0Weight = selector.sub(1).abs().oneMinus().clamp();
        const layer1Weight = selector.sub(2).abs().oneMinus().clamp();
        const stateColor = padsNode.mul(padsWeight)
            .add(layer0Node.mul(layer0Weight))
            .add(layer1Node.mul(layer1Weight));
        this.outputNode = vec4(stateColor.rgb.mul(this.brightness), 1);
        this.needsUpdate = true;
    }
}
//# sourceMappingURL=StateTextureMaterialBase.js.map
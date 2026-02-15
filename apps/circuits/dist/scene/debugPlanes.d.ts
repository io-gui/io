import { Group, Texture } from 'three/webgpu';
export declare class DebugPlanes extends Group {
    private readonly _planes;
    private readonly _planeGeometry;
    constructor(padsTexture?: Texture, layer0Texture?: Texture, layer1Texture?: Texture);
    update(boardWidth: number, boardHeight: number, padsTexture: Texture, layer0Texture: Texture, layer1Texture: Texture): void;
    dispose(): void;
    private _createPlane;
}
//# sourceMappingURL=debugPlanes.d.ts.map
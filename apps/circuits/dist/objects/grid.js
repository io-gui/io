import { LineSegments, LineBasicMaterial, Float32BufferAttribute, BufferGeometry, Color, AdditiveBlending } from 'three/webgpu';
class Grid extends LineSegments {
    constructor() {
        const geometry = new BufferGeometry();
        const material = new LineBasicMaterial({ transparent: true, vertexColors: true, toneMapped: false, blending: AdditiveBlending });
        super(geometry, material);
    }
    update(width, height) {
        if (width === 0 || height === 0) {
            this.geometry.setAttribute('position', new Float32BufferAttribute([], 3));
            this.geometry.setAttribute('color', new Float32BufferAttribute([], 4));
            return;
        }
        const color = new Color(0x666666);
        const color2 = new Color(0x333333);
        const hSegments = width * (height + 1);
        const vSegments = height * (width + 1);
        const dSegments = width * height * 4;
        const totalSegments = hSegments + vSegments + dSegments;
        const totalVertices = totalSegments * 2;
        const positions = new Float32Array(totalVertices * 3);
        const colors = new Float32Array(totalVertices * 4);
        let vi = 0;
        const pushVertex = (x, y, c) => {
            const pi = vi * 3;
            const ci = vi * 4;
            positions[pi] = x;
            positions[pi + 1] = y;
            positions[pi + 2] = 0;
            c.toArray(colors, ci);
            colors[ci + 3] = 1;
            vi++;
        };
        // Horizontal segments
        for (let iz = 0; iz <= height; iz++) {
            for (let ix = 0; ix < width; ix++) {
                pushVertex(ix, iz, color);
                pushVertex(ix + 1, iz, color);
            }
        }
        // Vertical segments
        for (let ix = 0; ix <= width; ix++) {
            for (let iz = 0; iz < height; iz++) {
                pushVertex(ix, iz, color);
                pushVertex(ix, iz + 1, color);
            }
        }
        // Diagonal segments (4 per cell: center to each corner)
        for (let cz = 0; cz < height; cz++) {
            for (let cx = 0; cx < width; cx++) {
                const centerX = cx + 0.5;
                const centerZ = cz + 0.5;
                pushVertex(centerX, centerZ, color2);
                pushVertex(cx, cz, color);
                pushVertex(centerX, centerZ, color2);
                pushVertex(cx + 1, cz, color);
                pushVertex(centerX, centerZ, color2);
                pushVertex(cx, cz + 1, color);
                pushVertex(centerX, centerZ, color2);
                pushVertex(cx + 1, cz + 1, color);
            }
        }
        this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new Float32BufferAttribute(colors, 4));
    }
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}
export { Grid };
//# sourceMappingURL=grid.js.map
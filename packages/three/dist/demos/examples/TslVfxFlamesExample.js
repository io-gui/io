var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Color, DataTexture, DoubleSide, RGBAFormat, Sprite, SpriteNodeMaterial, SRGBColorSpace, TextureLoader, LinearFilter } from 'three/webgpu';
import { TWO_PI, oneMinus, spherizeUV, sin, step, texture, Fn, uv, vec2, vec3, vec4, mix, billboarding } from 'three/tsl';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * Seconds of the timeline loop. The noise scrolls (0.25 to 1.5 units/s) repeat in 20 s; the 10 rad/s flicker does
 * not quite, so it jumps once per loop.
 */
const PERIOD = 20;
/** The gradient the source paints on a 128 × 1 canvas, as a texture: sRGB stops interpolated linearly in sRGB, as canvas gradients are. */
function createGradientTexture(colors, width = 128) {
    const stops = colors.map(hex => new Color().setStyle(hex, SRGBColorSpace).getRGB(new Color(), SRGBColorSpace));
    const data = new Uint8Array(width * 4);
    for (let x = 0; x < width; x++) {
        const t = (x + 0.5) / width * (stops.length - 1);
        const i = Math.min(Math.floor(t), stops.length - 2);
        const f = t - i;
        data[x * 4] = Math.round((stops[i].r + (stops[i + 1].r - stops[i].r) * f) * 255);
        data[x * 4 + 1] = Math.round((stops[i].g + (stops[i + 1].g - stops[i].g) * f) * 255);
        data[x * 4 + 2] = Math.round((stops[i].b + (stops[i + 1].b - stops[i].b) * f) * 255);
        data[x * 4 + 3] = 255;
    }
    const gradientTexture = new DataTexture(data, width, 1, RGBAFormat);
    gradientTexture.colorSpace = SRGBColorSpace;
    gradientTexture.magFilter = LinearFilter;
    gradientTexture.minFilter = LinearFilter;
    gradientTexture.needsUpdate = true;
    return gradientTexture;
}
/**
 * Two TSL flame sprites, billboarded around the vertical axis: a colored one from cellular noise and a white one from
 * displaced Perlin noise, both scrolled by document time. Plays when opened.
 */
let TslVfxFlamesExample = class TslVfxFlamesExample extends Document {
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        this.scene.background = new Color(0x201919);
        const time = this.timeline.timeNode;
        // textures
        // Views draw on document changes only, so report each texture when it arrives.
        const onLoad = () => this.notify({ kind: 'material' });
        const textureLoader = new TextureLoader();
        const cellularTexture = textureLoader.load('https://threejs.org/examples/textures/noises/voronoi/grayscale-256x256.png', onLoad);
        const perlinTexture = textureLoader.load('https://threejs.org/examples/textures/noises/perlin/rgb-256x256.png', onLoad);
        // gradient
        const gradientTexture = createGradientTexture([
            '#090033',
            '#5f1f93',
            '#e02e96',
            '#ffbd80',
            '#fff0db',
        ]);
        // flame 1 material
        const flame1Material = new SpriteNodeMaterial({ side: DoubleSide });
        flame1Material.colorNode = Fn(() => {
            // main UV
            const mainUv = uv().toVar();
            mainUv.assign(spherizeUV(mainUv, 10).mul(0.6).add(0.2)); // spherize
            mainUv.assign(mainUv.pow(vec2(1, 2))); // stretch
            mainUv.assign(mainUv.mul(2, 1).sub(vec2(0.5, 0))); // scale
            // gradients
            const gradient1 = sin(time.mul(10).sub(mainUv.y.mul(TWO_PI).mul(2))).toVar();
            const gradient2 = mainUv.y.smoothstep(0, 1).toVar();
            mainUv.x.addAssign(gradient1.mul(gradient2).mul(0.2));
            // cellular noise
            const cellularUv = mainUv.mul(0.5).add(vec2(0, time.negate().mul(0.5))).mod(1);
            const cellularNoise = texture(cellularTexture, cellularUv, 0).r.oneMinus().smoothstep(0, 0.5).oneMinus();
            cellularNoise.mulAssign(gradient2);
            // shape
            const shape = mainUv.sub(0.5).mul(vec2(3, 2)).length().oneMinus().toVar();
            shape.assign(shape.sub(cellularNoise));
            // gradient color
            const gradientColor = texture(gradientTexture, vec2(shape.remap(0, 1, 0, 1), 0));
            // output
            const color = mix(gradientColor, vec3(1), shape.step(0.8));
            const alpha = shape.smoothstep(0, 0.3);
            return vec4(color.rgb, alpha);
        })();
        // flame 2 material
        const flame2Material = new SpriteNodeMaterial({ side: DoubleSide });
        flame2Material.colorNode = Fn(() => {
            // main UV
            const mainUv = uv().toVar();
            mainUv.assign(spherizeUV(mainUv, 10).mul(0.6).add(0.2)); // spherize
            mainUv.assign(mainUv.abs().pow(vec2(1, 3)).mul(mainUv.sign())); // stretch
            mainUv.assign(mainUv.mul(2, 1).sub(vec2(0.5, 0))); // scale
            // perlin noise
            const perlinUv = mainUv.add(vec2(0, time.negate().mul(1))).mod(1);
            const perlinNoise = texture(perlinTexture, perlinUv, 0).sub(0.5).mul(1);
            mainUv.x.addAssign(perlinNoise.x.mul(0.5));
            // gradients
            const gradient1 = sin(time.mul(10).sub(mainUv.y.mul(TWO_PI).mul(2)));
            const gradient2 = mainUv.y.smoothstep(0, 1);
            const gradient3 = oneMinus(mainUv.y).smoothstep(0, 0.3);
            mainUv.x.addAssign(gradient1.mul(gradient2).mul(0.2));
            // displaced perlin noise
            const displacementPerlinUv = mainUv.mul(0.5).add(vec2(0, time.negate().mul(0.25))).mod(1);
            const displacementPerlinNoise = texture(perlinTexture, displacementPerlinUv, 0).sub(0.5).mul(1);
            const displacedPerlinUv = mainUv.add(vec2(0, time.negate().mul(0.5))).add(displacementPerlinNoise).mod(1);
            const displacedPerlinNoise = texture(perlinTexture, displacedPerlinUv, 0).sub(0.5).mul(1);
            mainUv.x.addAssign(displacedPerlinNoise.mul(0.5));
            // cellular noise
            const cellularUv = mainUv.add(vec2(0, time.negate().mul(1.5))).mod(1);
            const cellularNoise = texture(cellularTexture, cellularUv, 0).r.oneMinus().smoothstep(0.25, 1);
            // shape
            const shape = step(mainUv.sub(0.5).mul(vec2(6, 1)).length(), 0.5);
            shape.assign(shape.mul(cellularNoise));
            shape.mulAssign(gradient3);
            shape.assign(step(0.01, shape));
            // output
            return vec4(vec3(1), shape);
        })();
        // billboarding - follow the camera rotation only horizontally
        flame1Material.vertexNode = billboarding({ horizontalRotation: true });
        flame2Material.vertexNode = billboarding({ horizontalRotation: true });
        // meshes
        const flame1 = new Sprite(flame1Material);
        flame1.name = 'Flame 1';
        flame1.center.set(0.5, 0);
        flame1.scale.x = 0.5; // optional
        flame1.position.x = -0.5;
        this.scene.add(flame1);
        const flame2 = new Sprite(flame2Material);
        flame2.name = 'Flame 2';
        flame2.center.set(0.5, 0);
        flame2.position.x = 0.5;
        this.scene.add(flame2);
    }
};
TslVfxFlamesExample = __decorate([
    Register
], TslVfxFlamesExample);
export { TslVfxFlamesExample };

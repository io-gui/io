import { Register, IoElement, Storage as $ } from '@io-gui/core';
import { ioLayout, Split } from '@io-gui/layout';
import { MenuOption } from '@io-gui/menus';
import { ioThreeViewport } from '@io-gui/three';
import { ComputeTextureExample } from '../examples/compute_texture.js';
import { VolumePerlinExample } from '../examples/volume_perlin.js';
import { CameraExample } from '../examples/camera.js';
import { MiscAnimationGroupsExample } from '../examples/misc_animation_groups.js';
import { AnimationKeyframesExample } from '../examples/animation_keyframes.js';
import { CameraArrayExample } from '../examples/camera_array.js';
import { CameraLogarithmicDepthBufferExample } from '../examples/camera_logarithmicdepthbuffer.js';
const version = 1;
const split = new Split({
    children: [
        {
            orientation: 'vertical',
            children: [
                {
                    orientation: 'horizontal',
                    children: [
                        { tabs: [
                                { id: 'ComputeTexture', icon: 'io:numeric-1-box' },
                                { id: 'VolumePerlin', icon: 'io:numeric-2-box' },
                            ] },
                        { tabs: [
                                { id: 'CameraArray', icon: 'io:numeric-8-box' },
                                { id: 'CameraLogDepth', icon: 'io:numeric-9-box' },
                            ] },
                    ]
                },
                {
                    orientation: 'horizontal',
                    children: [
                        { tabs: [
                                { id: 'Camera', icon: 'io:numeric-3-box' }
                            ] },
                        { tabs: [
                                { id: 'Camera(OrthographicCamera)', icon: 'io:numeric-4-box' },
                                { id: 'Camera(PerspectiveCamera)', icon: 'io:numeric-5-box' },
                            ] },
                    ]
                },
                {
                    orientation: 'horizontal',
                    children: [
                        { tabs: [{ id: 'MiscAnimationGroups', icon: 'io:numeric-6-box' }] },
                        { tabs: [{ id: 'AnimationKeyframes', icon: 'io:numeric-7-box' }] },
                    ]
                }
            ]
        }
    ]
});
export class IoThreeDemo extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        background-color: #f00;
        max-width: 100%;
        max-height: 100%;
      }
    `;
    }
    ready() {
        const Camera = new CameraExample();
        this.render([
            ioLayout({
                elements: [
                    ioThreeViewport({ id: 'ComputeTexture', state: new ComputeTextureExample(), cameraSelect: 'front' }),
                    ioThreeViewport({ id: 'VolumePerlin', state: new VolumePerlinExample() }),
                    ioThreeViewport({ id: 'Camera', state: Camera, playing: true, cameraSelect: 'top', clearColor: 0x443322 }),
                    ioThreeViewport({ id: 'Camera(OrthographicCamera)', state: Camera, playing: true, cameraSelect: 'scene:orthographicCamera' }),
                    ioThreeViewport({ id: 'Camera(PerspectiveCamera)', state: Camera, playing: true, cameraSelect: 'scene:perspectiveCamera' }),
                    ioThreeViewport({ id: 'MiscAnimationGroups', state: new MiscAnimationGroupsExample(), playing: true }),
                    ioThreeViewport({ id: 'AnimationKeyframes', state: new AnimationKeyframesExample(), playing: true }),
                    ioThreeViewport({ id: 'CameraArray', state: new CameraArrayExample(), playing: true, cameraSelect: 'scene:arrayCamera' }),
                    ioThreeViewport({ id: 'CameraLogDepth', state: new CameraLogarithmicDepthBufferExample(), playing: true, cameraSelect: 'scene:logarithmicCamera' }),
                ],
                split: $({ key: `viewport-split-v${version}`, storage: 'local', value: split }),
                addMenuOption: new MenuOption({
                    id: 'addMenuOption',
                    mode: 'none',
                    options: [
                        { id: 'Viewports', mode: 'none', options: [
                                { id: 'ComputeTexture', icon: 'io:numeric-1-box', mode: 'none' },
                                { id: 'VolumePerlin', icon: 'io:numeric-2-box', mode: 'none' },
                                { id: 'Camera', icon: 'io:numeric-3-box', mode: 'none' },
                                { id: 'Camera(OrthographicCamera)', icon: 'io:numeric-4-box', mode: 'none' },
                                { id: 'Camera(PerspectiveCamera)', icon: 'io:numeric-5-box', mode: 'none' },
                                { id: 'MiscAnimationGroups', icon: 'io:numeric-6-box', mode: 'none' },
                                { id: 'AnimationKeyframes', icon: 'io:numeric-7-box', mode: 'none' },
                                { id: 'CameraArray', icon: 'io:numeric-8-box', mode: 'none' },
                                { id: 'CameraLogDepth', icon: 'io:numeric-9-box', mode: 'none' },
                            ] },
                    ],
                }),
            })
        ]);
    }
}
Register(IoThreeDemo);
export const ioThreeDemo = IoThreeDemo.vConstructor;
//# sourceMappingURL=IoThreeDemo.js.map
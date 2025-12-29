var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AnimationClip, AnimationMixer, AnimationObjectGroup, BoxGeometry, ColorKeyframeTrack, InterpolateDiscrete, Mesh, MeshBasicMaterial, NumberKeyframeTrack, Quaternion, QuaternionKeyframeTrack, Vector3 } from 'three/webgpu';
import { Register } from '@io-gui/core';
import { ThreeState } from '@io-gui/three';
let MiscAnimationGroupsExample = class MiscAnimationGroupsExample extends ThreeState {
    mixer;
    constructor() {
        super();
        // all objects of this animation group share a common animation state
        const animationGroup = new AnimationObjectGroup();
        const geometry = new BoxGeometry(5, 5, 5);
        const material = new MeshBasicMaterial({ transparent: true });
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                const mesh = new Mesh(geometry, material);
                mesh.position.x = 32 - (16 * i);
                mesh.position.y = 0;
                mesh.position.z = 32 - (16 * j);
                this.scene.add(mesh);
                animationGroup.add(mesh);
            }
        }
        // create some keyframe tracks
        const xAxis = new Vector3(1, 0, 0);
        const qInitial = new Quaternion().setFromAxisAngle(xAxis, 0);
        const qFinal = new Quaternion().setFromAxisAngle(xAxis, Math.PI);
        const quaternionKF = new QuaternionKeyframeTrack('.quaternion', [0, 1, 2], [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w]);
        const colorKF = new ColorKeyframeTrack('.material.color', [0, 1, 2], [1, 0, 0, 0, 1, 0, 0, 0, 1], InterpolateDiscrete);
        const opacityKF = new NumberKeyframeTrack('.material.opacity', [0, 1, 2], [1, 0, 1]);
        // create clip
        const clip = new AnimationClip('default', 3, [quaternionKF, colorKF, opacityKF]);
        // apply the animation group to the mixer as the root object
        this.mixer = new AnimationMixer(animationGroup);
        const clipAction = this.mixer.clipAction(clip);
        clipAction.play();
    }
    onAnimate(delta) {
        this.mixer.update(delta);
    }
};
MiscAnimationGroupsExample = __decorate([
    Register
], MiscAnimationGroupsExample);
export { MiscAnimationGroupsExample };
//# sourceMappingURL=misc_animation_groups.js.map
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AnimationClip, AnimationMixer, BoxGeometry, ColorKeyframeTrack, InterpolateDiscrete, Mesh, MeshBasicMaterial, NumberKeyframeTrack, PerspectiveCamera, Quaternion, QuaternionKeyframeTrack, Vector3, VectorKeyframeTrack } from 'three/webgpu';
import { Register } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
/**
 * A box animated by keyframe tracks for position, scale, rotation, color and opacity, in one 3 s clip. The source's
 * camera is a scene camera: its framing covers the box's path, which leaves the bounds views frame on first show.
 * Plays when opened.
 */
let AnimationKeysExample = class AnimationKeysExample extends Document {
    mixer;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true }), ...args });
        const camera = new PerspectiveCamera(40, 1, 1, 1000);
        camera.name = 'Camera';
        camera.position.set(25, 25, 50);
        camera.lookAt(this.scene.position);
        this.scene.add(camera);
        const geometry = new BoxGeometry(5, 5, 5);
        const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true });
        const mesh = new Mesh(geometry, material);
        mesh.name = 'Box';
        this.scene.add(mesh);
        // create a keyframe track (i.e. a timed sequence of keyframes) for each animated property
        // Note: the keyframe track type should correspond to the type of the property being animated
        // POSITION
        const positionKF = new VectorKeyframeTrack('.position', [0, 1, 2], [0, 0, 0, 30, 0, 0, 0, 0, 0]);
        // SCALE
        const scaleKF = new VectorKeyframeTrack('.scale', [0, 1, 2], [1, 1, 1, 2, 2, 2, 1, 1, 1]);
        // ROTATION
        // Rotation should be performed using quaternions, using a QuaternionKeyframeTrack
        // Interpolating Euler angles (.rotation property) can be problematic and is currently not supported
        // set up rotation about x axis
        const xAxis = new Vector3(1, 0, 0);
        const qInitial = new Quaternion().setFromAxisAngle(xAxis, 0);
        const qFinal = new Quaternion().setFromAxisAngle(xAxis, Math.PI);
        const quaternionKF = new QuaternionKeyframeTrack('.quaternion', [0, 1, 2], [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w]);
        // COLOR
        const colorKF = new ColorKeyframeTrack('.material.color', [0, 1, 2], [1, 0, 0, 0, 1, 0, 0, 0, 1], InterpolateDiscrete);
        // OPACITY
        const opacityKF = new NumberKeyframeTrack('.material.opacity', [0, 1, 2], [1, 0, 1]);
        // create an animation sequence with the tracks
        // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
        const clip = new AnimationClip('Action', 3, [scaleKF, positionKF, quaternionKF, colorKF, opacityKF]);
        this.mixer = new AnimationMixer(mesh);
        this.mixer.clipAction(clip).play();
        this.timeline.duration = clip.duration;
    }
    onAnimate(delta) {
        this.mixer.update(delta);
    }
};
AnimationKeysExample = __decorate([
    Register
], AnimationKeysExample);
export { AnimationKeysExample };

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BoxGeometry, Group, Mesh, MeshStandardMaterial, PerspectiveCamera, RectAreaLight, RectAreaLightNode, TorusKnotGeometry } from 'three/webgpu';
import { checker, uv } from 'three/tsl';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightTexturesLib } from 'three/addons/lights/RectAreaLightTexturesLib.js';
import { Register, Property } from '@io-gui/core';
import { Document, Timeline } from '@io-gui/three';
import { registerEditorGroups } from '@io-gui/editors';
RectAreaLightNode.setLTC(RectAreaLightTexturesLib.init());
/** Seconds in which the lights' turns repeat (they turn at -1, 0.5 and 1 rad/s): the timeline length. */
const PERIOD = 4 * Math.PI;
/**
 * A glossy torus knot lit by three turning rect area lights (red, green, blue) over a checker-rough floor. The
 * source's camera is a scene camera: the 2000-unit floor dwarfs the knot in the views' first-show framing.
 * Plays when opened.
 */
let LightsRectarealightExample = class LightsRectarealightExample extends Document {
    rectLight1;
    rectLight2;
    rectLight3;
    helpers;
    constructor(args) {
        super({ timeline: new Timeline({ autoplay: true, duration: PERIOD }), ...args });
        const camera = new PerspectiveCamera(45, 1, 1, 1000);
        camera.name = 'Camera';
        camera.position.set(0, 5, -15);
        camera.lookAt(0, 5.5, 0);
        this.scene.add(camera);
        this.rectLight1 = new RectAreaLight(0xff0000, 5, 4, 10);
        this.rectLight1.name = 'Red';
        this.rectLight1.position.set(-5, 6, 5);
        this.scene.add(this.rectLight1);
        this.rectLight2 = new RectAreaLight(0x00ff00, 5, 4, 10);
        this.rectLight2.name = 'Green';
        this.rectLight2.position.set(0, 6, 5);
        this.scene.add(this.rectLight2);
        this.rectLight3 = new RectAreaLight(0x0000ff, 5, 4, 10);
        this.rectLight3.name = 'Blue';
        this.rectLight3.position.set(5, 6, 5);
        this.scene.add(this.rectLight3);
        const geoFloor = new BoxGeometry(2000, 0.1, 2000);
        const matStdFloor = new MeshStandardMaterial({ color: 0x444444 });
        matStdFloor.roughnessNode = checker(uv().mul(400));
        const mshStdFloor = new Mesh(geoFloor, matStdFloor);
        mshStdFloor.name = 'Floor';
        mshStdFloor.userData.selectable = false;
        this.scene.add(mshStdFloor);
        const geoKnot = new TorusKnotGeometry(1.5, 0.5, 200, 16);
        const matKnot = new MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 });
        const meshKnot = new Mesh(geoKnot, matKnot);
        meshKnot.name = 'TorusKnot';
        meshKnot.position.set(0, 5.5, 0);
        this.scene.add(meshKnot);
        // The light panels, after the lights they follow.
        this.helpers = new Group();
        this.helpers.name = 'Helpers';
        this.helpers.userData.selectable = false;
        this.helpers.add(new RectAreaLightHelper(this.rectLight1));
        this.helpers.add(new RectAreaLightHelper(this.rectLight2));
        this.helpers.add(new RectAreaLightHelper(this.rectLight3));
        this.scene.add(this.helpers);
        this.showHelpersChanged();
    }
    showHelpersChanged() {
        if (this.helpers)
            this.helpers.visible = this.showHelpers;
    }
    onAnimate(delta, time) {
        this.rectLight1.rotation.y = -time;
        this.rectLight2.rotation.y = time * .5;
        this.rectLight3.rotation.y = time;
    }
};
__decorate([
    Property({ type: Boolean, value: true })
], LightsRectarealightExample.prototype, "showHelpers", void 0);
LightsRectarealightExample = __decorate([
    Register
], LightsRectarealightExample);
export { LightsRectarealightExample };
registerEditorGroups(LightsRectarealightExample, {
    Main: ['showHelpers'],
});

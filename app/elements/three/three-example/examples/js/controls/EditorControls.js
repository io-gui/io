/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */


import {IoNode} from "../../../../../../../src/io-node.js";
import * as THREE from "../../../../../../../lib/three.module.js";

// internals

let vector = new THREE.Vector3();

let STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2 };
let state = STATE.NONE;

let normalMatrix = new THREE.Matrix3();
let pointer = new THREE.Vector2();
let pointerOld = new THREE.Vector2();
let spherical = new THREE.Spherical();

// touch

let touches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
let prevTouches = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];

let prevDistance = null;

export default class EditorControls extends IoNode {
	static get properties() {
		return {
			object: null,
			domElement: document,
			enabled: true,
			target: THREE.Vector3,
			panSpeed: 0.002,
			zoomSpeed: 0.005,
			rotationSpeed: 0.005,
		};
	}
  constructor(object, domElement) {
		// TODO
		super();
		this.object = object;
		this.domElement = domElement;
		this.object.lookAt(this.target); //TODO
		this.init();
	}
	init() {
		this.domElement.addEventListener('contextmenu', this.contextmenu, false);
		this.domElement.addEventListener('mousedown', this.onMouseDown, false);
		this.domElement.addEventListener('wheel', this.onMouseWheel, false);

		this.domElement.addEventListener('touchstart', this.touchStart, false);
		this.domElement.addEventListener('touchmove', this.touchMove, false);
	}
	dispose() {
		this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
		this.domElement.removeEventListener('mousedown', this.onMouseDown, false);
		this.domElement.removeEventListener('wheel', this.onMouseWheel, false);

		this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
		this.domElement.removeEventListener('mouseup', this.onMouseUp, false);
		this.domElement.removeEventListener('mouseout', this.onMouseUp, false);
		this.domElement.removeEventListener('dblclick', this.onMouseUp, false);

		this.domElement.removeEventListener('touchstart', this.touchStart, false);
		this.domElement.removeEventListener('touchmove', this.touchMove, false);
	}
	focus(target) {
		let box = new THREE.Box3().setFromObject(target);
		let distance;
		if (box.isEmpty() === false) {
			this.target.copy(box.getCenter());
			distance = box.getBoundingSphere().radius;
		} else {
			// Focusing on an Group, AmbientLight, etc
			this.target.setFromMatrixPosition(target.matrixWorld);
			distance = 0.1;
		}
		let delta = new THREE.Vector3(0, 0, 1);
		delta.applyQuaternion(this.object.quaternion);
		delta.multiplyScalar(distance * 4);
		this.object.position.copy(target).add(delta);
		this.dispatchEvent('change');
	}
	pan(delta) {
		let distance = this.object.position.distanceTo(this.target);
		delta.multiplyScalar(distance * this.panSpeed);
		delta.applyMatrix3(normalMatrix.getNormalMatrix(this.object.matrix));
		this.object.position.add(delta);
		this.target.add(delta);
		this.dispatchEvent('change');
	}
	zoom(delta) {
		let distance = this.object.position.distanceTo(this.target);
		delta.multiplyScalar(distance * this.zoomSpeed);
		if (delta.length() > distance) return;
		delta.applyMatrix3(normalMatrix.getNormalMatrix(this.object.matrix));
		this.object.position.add(delta);
		this.dispatchEvent('change');
	}
	rotate(delta) {
		vector.copy(this.object.position).sub(this.target);
		spherical.setFromVector3(vector);
		spherical.theta += delta.x;
		spherical.phi += delta.y;
		spherical.makeSafe();
		vector.setFromSpherical(spherical);
		this.object.position.copy(this.target).add(vector);
		this.object.lookAt(this.target);
		this.dispatchEvent('change');
	}
	onMouseDown(event) {
		if (this.enabled === false) return;
		if (event.button === 0) {
			state = STATE.ROTATE;
		} else if (event.button === 1) {
			state = STATE.ZOOM;
		} else if (event.button === 2) {
			state = STATE.PAN;
		}
		pointerOld.set(event.clientX, event.clientY);
		this.domElement.addEventListener('mousemove', this.onMouseMove, false);
		this.domElement.addEventListener('mouseup', this.onMouseUp, false);
		this.domElement.addEventListener('mouseout', this.onMouseUp, false);
		this.domElement.addEventListener('dblclick', this.onMouseUp, false);
	}
	onMouseMove(event) {
		if (this.enabled === false) return;
		pointer.set(event.clientX, event.clientY);
		let movementX = pointer.x - pointerOld.x;
		let movementY = pointer.y - pointerOld.y;
		if (state === STATE.ROTATE) {
			this.rotate(new THREE.Vector3(- movementX * this.rotationSpeed, - movementY * this.rotationSpeed, 0));
		} else if (state === STATE.ZOOM) {
			this.zoom(new THREE.Vector3(0, 0, movementY));
		} else if (state === STATE.PAN) {
			this.pan(new THREE.Vector3(- movementX, movementY, 0));
		}
		pointerOld.set(event.clientX, event.clientY);
	}
	onMouseUp() {
		this.domElement.removeEventListener('mousemove', this.onMouseMove, false);
		this.domElement.removeEventListener('mouseup', this.onMouseUp, false);
		this.domElement.removeEventListener('mouseout', this.onMouseUp, false);
		this.domElement.removeEventListener('dblclick', this.onMouseUp, false);
		state = STATE.NONE;
	}
	onMouseWheel(event) {
		event.preventDefault();
		// if (this.enabled === false) return;
		this.zoom(new THREE.Vector3(0, 0, event.deltaY));
	}
	touchStart(event) {
		if (this.enabled === false) return;
		switch (event.touches.length) {
			case 1:
				touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
				touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0);
				break;
			case 2:
				touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
				touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0);
				prevDistance = touches[0].distanceTo(touches[1]);
				break;
		}
		prevTouches[0].copy(touches[0]);
		prevTouches[1].copy(touches[1]);
	}
	touchMove(event) {
		if (this.enabled === false) return;
		event.preventDefault();
		event.stopPropagation();
		function getClosest(touch, touches) {
			let closest = touches[0];
			for (let i in touches) {
				if (closest.distanceTo(touch) > touches[i].distanceTo(touch)) closest = touches[i];
			}
			return closest;
		}
		switch (event.touches.length) {
			case 1:
				touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
				touches[1].set(event.touches[0].pageX, event.touches[0].pageY, 0);
				this.rotate(touches[0].sub(getClosest(touches[0], prevTouches)).multiplyScalar(- this.rotationSpeed));
				break;
			case 2: {
				touches[0].set(event.touches[0].pageX, event.touches[0].pageY, 0);
				touches[1].set(event.touches[1].pageX, event.touches[1].pageY, 0);
				let distance = touches[0].distanceTo(touches[1]);
				this.zoom(new THREE.Vector3(0, 0, prevDistance - distance));
				prevDistance = distance;
				let offset0 = touches[0].clone().sub(getClosest(touches[0], prevTouches));
				let offset1 = touches[1].clone().sub(getClosest(touches[1], prevTouches));
				offset0.x = - offset0.x;
				offset1.x = - offset1.x;
				this.pan(offset0.add(offset1).multiplyScalar(0.5));
				break;
			}
		}
		prevTouches[0].copy(touches[0]);
		prevTouches[1].copy(touches[1]);
	}
	contextmenu(event) {
		event.preventDefault();
	}
}

import { Register } from '@io-gui/core';
import {
	AnimationMixer,
	BoxGeometry,
	Clock,
	DirectionalLight,
	Euler,
	PerspectiveCamera,
	HemisphereLight,
	Matrix4,
	Mesh,
	NodeMaterial,
	Skeleton,
	SkeletonHelper,
	MathUtils,
  Node,
} from 'three/webgpu';
import {
	color,
	screenUV,
	hue,
	reflector,
	time,
	Fn,
	vec2,
	length,
	atan,
	float,
	sin,
	cos,
	vec3,
	sub,
	mul,
	pow,
	blendDodge,
	normalWorldGeometry,
} from 'three/tsl';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { ThreeApplet } from '@io-gui/three';

const lightSpeed = /*#__PURE__*/ Fn<[Node]>(([suv_immutable]) => {
	// forked from https://www.shadertoy.com/view/7ly3D1
	const suv = vec2(suv_immutable);
	const uv = vec2(length(suv), atan(suv.y, suv.x));
	const offset = float(float(.1).mul(sin(uv.y.mul(10.).sub(time.mul(.6)))).mul(cos(uv.y.mul(48.).add(time.mul(.3)))).mul(cos(uv.y.mul(3.7).add(time))));
	const rays = vec3(vec3(sin(uv.y.mul(150.).add(time)).mul(.5).add(.5)).mul(vec3(sin(uv.y.mul(80.).sub(time.mul(0.6))).mul(.5).add(.5))).mul(vec3(sin(uv.y.mul(45.).add(time.mul(0.8))).mul(.5).add(.5))).mul(vec3(sub(1., cos(uv.y.add(mul(22., time).sub(pow(uv.x.add(offset), .3).mul(60.))))))).mul(vec3(uv.x.mul(2.))));
	return rays;
}).setLayout({
	name: 'lightSpeed',
	type: 'vec3',
	inputs: [
		{ name: 'suv', type: 'vec2' }
	]
});

@Register
export class AnimationRetargetingExample extends ThreeApplet {
	public sourceMixer?: AnimationMixer;
	public targetMixer?: AnimationMixer;
  public camera: PerspectiveCamera;

	constructor() {
		super();

		// this.toneMapping = NeutralToneMapping;

		// Background
		const coloredVignette = screenUV.distance(.5).mix(hue(color(0x0175ad), time.mul(.1)), hue(color(0x02274f), time.mul(.5)));
		const lightSpeedEffect = lightSpeed(normalWorldGeometry).clamp();
		const lightSpeedSky = normalWorldGeometry.y.remapClamp(-.1, 1).mix(0, lightSpeedEffect);
		const composedBackground = blendDodge(coloredVignette, lightSpeedSky);
		this.scene.backgroundNode = composedBackground;

		// Lights
		const light = new HemisphereLight(0xe9c0a5, 0x0175ad, 5);
		this.scene.add(light);

		const dirLight = new DirectionalLight(0xfff9ea, 4);
		dirLight.position.set(2, 5, 2);
		this.scene.add(dirLight);

		// Floor with reflection
		const reflection = reflector();
		reflection.target.rotateX(-Math.PI / 2);
		this.scene.add(reflection.target);

		const floorMaterial = new NodeMaterial();
		floorMaterial.colorNode = reflection;
		floorMaterial.opacity = .2;
		floorMaterial.transparent = true;

		const floor = new Mesh(new BoxGeometry(50, .001, 50), floorMaterial);
		floor.receiveShadow = true;
		floor.position.set(0, 0, 0);
		this.scene.add(floor);

    this.camera = new PerspectiveCamera(40, 1, .25, 50);
    this.camera.position.set(0, 1, 4);
    this.camera.name = 'camera';
    this.scene.add(this.camera);

		// Load and setup models
		this.loadModels();
	}

  onResized(width: number, height: number) {
    super.onResized(width, height)
    const aspect = width / height
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
  }

	private async loadModels() {
		const [sourceModel, targetModel] = await Promise.all([
			new Promise((resolve, reject) => {
				new GLTFLoader().load('https://threejs.org/examples/models/gltf/Michelle.glb', resolve as any, undefined, reject);
			}),
			new Promise((resolve, reject) => {
				new GLTFLoader().load('https://threejs.org/examples/models/gltf/Soldier.glb', resolve as any, undefined, reject);
			})
		]);
    
		// Add models to scene
		this.scene.add((sourceModel as any).scene);
		this.scene.add((targetModel as any).scene);

		// Reposition models
		(sourceModel as any).scene.position.x -= .8;
		(targetModel as any).scene.position.x += .7;
		(targetModel as any).scene.position.z -= .1;

		// Readjust model
		(targetModel as any).scene.scale.setScalar(.01);

		// Flip models
		(sourceModel as any).scene.rotation.y = Math.PI / 2;
		(targetModel as any).scene.rotation.y = -Math.PI / 2;

		// Retarget
		const source = this.getSource(sourceModel);
		this.sourceMixer = source.mixer;
		this.targetMixer = this.retargetModel(source, targetModel);
	}

	private getSource(sourceModel: any) {
		const clip = sourceModel.animations[0];
		const skeleton = new Skeleton(new SkeletonHelper(sourceModel.scene).bones);
		const mixer = new AnimationMixer(sourceModel.scene);
		mixer.clipAction(sourceModel.animations[0]).play();

		return { clip, skeleton, mixer };
	}

	private retargetModel(sourceModel: any, targetModel: any) {
		const targetSkin = targetModel.scene.children[0].children[0];

		const rotateCW45 = new Matrix4().makeRotationY(MathUtils.degToRad(45));
		const rotateCCW180 = new Matrix4().makeRotationY(MathUtils.degToRad(-180));
		const rotateCW180 = new Matrix4().makeRotationY(MathUtils.degToRad(180));
		const rotateFoot = new Matrix4().makeRotationFromEuler(new Euler(MathUtils.degToRad(45), MathUtils.degToRad(180), MathUtils.degToRad(0)));

		const retargetOptions = {
			hip: 'mixamorigHips',
			scale: 1 / targetModel.scene.scale.y,
			localOffsets: {
				mixamorigLeftShoulder: rotateCW45,
				mixamorigRightShoulder: rotateCCW180,
				mixamorigLeftArm: rotateCW45,
				mixamorigRightArm: rotateCCW180,
				mixamorigLeftForeArm: rotateCW45,
				mixamorigRightForeArm: rotateCCW180,
				mixamorigLeftHand: rotateCW45,
				mixamorigRightHand: rotateCCW180,

				mixamorigLeftUpLeg: rotateCW180,
				mixamorigRightUpLeg: rotateCW180,
				mixamorigLeftLeg: rotateCW180,
				mixamorigRightLeg: rotateCW180,
				mixamorigLeftFoot: rotateFoot,
				mixamorigRightFoot: rotateFoot,
				mixamorigLeftToeBase: rotateCW180,
				mixamorigRightToeBase: rotateCW180
			},
			names: {
				mixamorigHips: 'mixamorigHips',
				mixamorigSpine: 'mixamorigSpine',
				mixamorigSpine2: 'mixamorigSpine2',
				mixamorigHead: 'mixamorigHead',

				mixamorigLeftShoulder: 'mixamorigLeftShoulder',
				mixamorigRightShoulder: 'mixamorigRightShoulder',
				mixamorigLeftArm: 'mixamorigLeftArm',
				mixamorigRightArm: 'mixamorigRightArm',
				mixamorigLeftForeArm: 'mixamorigLeftForeArm',
				mixamorigRightForeArm: 'mixamorigRightForeArm',
				mixamorigLeftHand: 'mixamorigLeftHand',
				mixamorigRightHand: 'mixamorigRightHand',

				mixamorigLeftUpLeg: 'mixamorigLeftUpLeg',
				mixamorigRightUpLeg: 'mixamorigRightUpLeg',
				mixamorigLeftLeg: 'mixamorigLeftLeg',
				mixamorigRightLeg: 'mixamorigRightLeg',
				mixamorigLeftFoot: 'mixamorigLeftFoot',
				mixamorigRightFoot: 'mixamorigRightFoot',
				mixamorigLeftToeBase: 'mixamorigLeftToeBase',
				mixamorigRightToeBase: 'mixamorigRightToeBase'
			}
		};

		const retargetedClip = SkeletonUtils.retargetClip(targetSkin, sourceModel.skeleton, sourceModel.clip, retargetOptions);

		const mixer = new AnimationMixer(targetSkin);
		mixer.clipAction(retargetedClip).play();

		return mixer;
	}

	onAnimate(delta: number) {
		if (this.sourceMixer) {
			this.sourceMixer.update(delta);
		}

		if (this.targetMixer) {
			this.targetMixer.update(delta);
		}
	}
}


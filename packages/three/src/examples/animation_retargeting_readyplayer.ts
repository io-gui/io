import { Register } from '@io-gui/core'
import {
	AnimationMixer,
	BoxGeometry,
	DirectionalLight,
	HemisphereLight,
	Mesh,
	NodeMaterial,
	PerspectiveCamera,
	Skeleton,
	SkeletonHelper,
} from 'three/webgpu'
import {
	color,
	screenUV,
	vec2,
	vec4,
	reflector,
	positionWorld,
} from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js'
import { ThreeApplet } from '@io-gui/three'

@Register
export class AnimationRetargetingReadyplayerExample extends ThreeApplet {
	public sourceMixer?: AnimationMixer
	public targetMixer?: AnimationMixer
	public camera: PerspectiveCamera

	constructor() {
		super()

		// Background
		const horizontalEffect = screenUV.x.mix(color(0x13172b), color(0x311649))
		const lightEffect = screenUV.distance(vec2(0.5, 1.0)).oneMinus().mul(color(0x0c5d68))
		this.scene.backgroundNode = horizontalEffect.add(lightEffect)

		// Lights
		const light = new HemisphereLight(0x311649, 0x0c5d68, 10)
		this.scene.add(light)

		const backLight = new DirectionalLight(0xffffff, 10)
		backLight.position.set(0, 5, -5)
		this.scene.add(backLight)

		const keyLight = new DirectionalLight(0xfff9ea, 4)
		keyLight.position.set(3, 5, 3)
		this.scene.add(keyLight)

		// Floor with reflection
		const reflection = reflector()
		reflection.target.rotateX(-Math.PI / 2)
		this.scene.add(reflection.target)

		const reflectionMask = positionWorld.xz.distance(0).mul(.1).clamp().oneMinus()

		const floorMaterial = new NodeMaterial()
		floorMaterial.colorNode = vec4(reflection.rgb, reflectionMask)
		floorMaterial.opacity = .2
		floorMaterial.transparent = true

		const floor = new Mesh(new BoxGeometry(50, .001, 50), floorMaterial)
		floor.receiveShadow = true
		floor.position.set(0, 0, 0)
		this.scene.add(floor)

		// Camera
		this.camera = new PerspectiveCamera(40, 1, .25, 50)
		this.camera.position.set(0, 3, 5)
    this.camera.lookAt(0, 1, 0)
		this.camera.name = 'camera'
		this.scene.add(this.camera)

		// Load and setup models
		void this.loadModels()
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
				new FBXLoader().load('https://threejs.org/examples/models/fbx/mixamo.fbx', resolve as any, undefined, reject)
			}),
			new Promise((resolve, reject) => {
				new GLTFLoader().load('https://threejs.org/examples/models/gltf/readyplayer.me.glb', resolve as any, undefined, reject)
			})
		])

		// Add models to scene
		this.scene.add(sourceModel as any)
		this.scene.add((targetModel as any).scene);

		// Reposition models
		(sourceModel as any).position.x -= .9;
		(targetModel as any).scene.position.x += .9;

		// Readjust model - mixamo use centimeters, readyplayer.me use meters (three.js scale is meters)
		(sourceModel as any).scale.setScalar(.01)

		// Retarget
		const source = this.getSource(sourceModel)
		this.sourceMixer = source.mixer
		this.targetMixer = this.retargetModel(source, targetModel)
	}

	private getSource(sourceModel: any) {
		const clip = sourceModel.animations[0]
		const helper = new SkeletonHelper(sourceModel)
		const skeleton = new Skeleton(helper.bones)
		const mixer = new AnimationMixer(sourceModel)
		mixer.clipAction(sourceModel.animations[0]).play()

		return { clip, skeleton, mixer }
	}

	private retargetModel(sourceModel: any, targetModel: any) {
		const targetSkin = targetModel.scene.children[0].children[1]

		const retargetOptions = {
			// specify the name of the source's hip bone
			hip: 'mixamorigHips',

			// preserve the scale of the target model
			scale: .01,

			// Map of target's bone names to source's bone names
			getBoneName: function (bone: any) {
				return 'mixamorig' + bone.name
			}
		}

		const retargetedClip = SkeletonUtils.retargetClip(targetSkin, sourceModel.skeleton, sourceModel.clip, retargetOptions)

		const mixer = new AnimationMixer(targetSkin)
		mixer.clipAction(retargetedClip).play()

		return mixer
	}

	onAnimate(delta: number) {

		if (this.sourceMixer) {
			this.sourceMixer.update(delta)
		}

		if (this.targetMixer) {
			this.targetMixer.update(delta)
		}
	}
}


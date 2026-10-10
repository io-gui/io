import { Property, Register } from '@io-gui/core'
import {
  AmbientLight,
  AnimationMixer,
  BoxGeometry,
  DoubleSide,
  Mesh,
  MeshBasicNodeMaterial,
  PerspectiveCamera,
  Vector3,
} from 'three/webgpu'
import {
  color,
  positionWorld,
  linearDepth,
  viewportLinearDepth,
  viewportSharedTexture,
  screenUV,
  hue,
  time,
  checker,
  uv,
  modelScale,
} from 'three/tsl'
import { hashBlur } from 'three/addons/tsl/display/hashBlur.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { ThreeDocument, ThreeDocumentProps, ioVector3 } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/**
 * A box whose backdrop material (blurred, depth, checker or pixel; Document tab) filters the dancing Michelle
 * model behind it. Plays when opened.
 */
@Register
export class BackdropAreaExample extends ThreeDocument {
  public mixer?: AnimationMixer
  public box: Mesh

  // Materials
  public blurredBlurMaterial: MeshBasicNodeMaterial
  public depthMaterial: MeshBasicNodeMaterial
  public checkerMaterial: MeshBasicNodeMaterial
  public pixelMaterial: MeshBasicNodeMaterial

  public materials: Record<string, MeshBasicNodeMaterial>

  public boxScale: Vector3

  @Property({type: String, value: 'blurred'})
  declare material: string

  constructor(args?: ThreeDocumentProps) {
    super({toneMappingExposure: 0.9, autoplay: true, ...args})

    // Background
    this.scene.backgroundNode = hue(screenUV.y.mix(color(0x66bbff), color(0x4466ff)), time.mul(0.1))

    // Lighting
    const ambient = new AmbientLight(0xffffff, 2.5)
    ambient.name = 'Ambient'
    this.scene.add(ambient)

    // Create materials
    // Compare depth from viewportLinearDepth with linearDepth() to create a distance field
    const depthDistance = viewportLinearDepth.distance(linearDepth())

    const depthAlphaNode = depthDistance.oneMinus().smoothstep( .90, 2 ).mul( 10 ).saturate()
    const depthBlurred = hashBlur( viewportSharedTexture(), depthDistance.smoothstep( 0, .6 ).mul( 40 ).clamp().mul( .1 ) )

    // Blurred material
    this.blurredBlurMaterial = new MeshBasicNodeMaterial()
    this.blurredBlurMaterial.backdropNode = depthBlurred.add(depthAlphaNode.mix(color(0x003399).mul(.3), 0))
    this.blurredBlurMaterial.transparent = true
    this.blurredBlurMaterial.side = DoubleSide

    // Depth material
    this.depthMaterial = new MeshBasicNodeMaterial()
    this.depthMaterial.backdropNode = depthAlphaNode
    this.depthMaterial.transparent = true
    this.depthMaterial.side = DoubleSide

    // Checker material
    this.checkerMaterial = new MeshBasicNodeMaterial()
    this.checkerMaterial.backdropNode = hashBlur(viewportSharedTexture(), .05)
    this.checkerMaterial.backdropAlphaNode = checker(uv().mul(3).mul(modelScale.xy))
    this.checkerMaterial.opacityNode = this.checkerMaterial.backdropAlphaNode
    this.checkerMaterial.transparent = true
    this.checkerMaterial.side = DoubleSide

    // Pixel material
    this.pixelMaterial = new MeshBasicNodeMaterial()
    this.pixelMaterial.backdropNode = viewportSharedTexture(screenUV.mul(100).floor().div(100))
    this.pixelMaterial.transparent = true

    // Materials map
    this.materials = {
      'blurred': this.blurredBlurMaterial,
      'depth': this.depthMaterial,
      'checker': this.checkerMaterial,
      'pixel': this.pixelMaterial
    }

    // Camera
    const camera = new PerspectiveCamera(50, 1, 0.1, 100)
    camera.name = 'Camera'
    camera.position.set(3, 2, 3)
    camera.lookAt(0, 1, 0)
    this.scene.add(camera)

    // Box
    this.box = new Mesh(new BoxGeometry(2, 2, 2), this.blurredBlurMaterial)
    this.box.name = 'Box'
    this.box.position.set(0, 1, 0)
    this.boxScale = this.box.scale
    this.box.renderOrder = 1
    this.scene.add(this.box)

    // Floor
    const floor = new Mesh(new BoxGeometry(3, .01, 3), new MeshBasicNodeMaterial({
      color: 0xff6600,
      opacityNode: positionWorld.xz.distance(0).oneMinus().clamp(),
      transparent: true,
      depthWrite: false
    }))
    floor.name = 'Floor'
    floor.userData.selectable = false
    this.scene.add(floor)

    // Load model
    this.loadModel()
    this.materialChanged()
  }

  materialChanged() {
    if (this.materials[this.material]) {
      this.box.material = this.materials[this.material]
    }
  }

  private loadModel() {
    const loader = new GLTFLoader()
    loader.load('https://threejs.org/examples/models/gltf/Michelle.glb', (gltf) => {
      const object = gltf.scene
      this.mixer = new AnimationMixer(object)

      const action = this.mixer.clipAction(gltf.animations[0])
      action.play()

      this.scene.add(object)

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: this.box}, true)
    })
  }

  override onAnimate(delta: number) {
    this.mixer?.update(delta)
  }
}

registerEditorConfig(BackdropAreaExample, [
  ['material', ioOptionSelect({
    model: new Menu({
      options: ['blurred', 'depth', 'checker', 'pixel']
    }),
  })],
  [Vector3, ioVector3({linkable: true})],
])

registerEditorGroups(BackdropAreaExample, {
  Main: ['material', 'boxScale'],
})

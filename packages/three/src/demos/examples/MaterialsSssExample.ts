import {
  AmbientLight,
  Color,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  MeshSSSNodeMaterial,
  PerspectiveCamera,
  PointLight,
  RepeatWrapping,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader
} from 'three/webgpu'
import { texture, uniform, vec3 } from 'three/tsl'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one turn of the bunny (0.2 rad/s): the timeline length, so looping is seamless. */
const PERIOD = 10 * Math.PI

/**
 * The Stanford bunny in `MeshSSSNodeMaterial`: light from the two point lights shows through it by a thickness map.
 * The thickness distortion, ambient, attenuation, power and scale are in the Document tab. Plays when opened.
 */
@Register
export class MaterialsSssExample extends Document {

  public model?: Mesh

  private distortionUniform = uniform( 0.1 )
  private ambientUniform = uniform( 0.4 )
  private attenuationUniform = uniform( 0.8 )
  private powerUniform = uniform( 2.0 )
  private scaleUniform = uniform( 16.0 )

  @Property({type: Number, value: 0.1})
  declare distortion: number

  @Property({type: Number, value: 0.4})
  declare ambient: number

  @Property({type: Number, value: 0.8})
  declare attenuation: number

  @Property({type: Number, value: 2.0})
  declare power: number

  @Property({type: Number, value: 16.0})
  declare scale: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 5000 )
    camera.name = 'Camera'
    camera.position.set( 0, 300, 1600 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    // Lights

    const ambientLight = new AmbientLight( 0xc1c1c1 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const directionalLight = new DirectionalLight( 0xffffff, 0.03 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 0.0, 0.5, 0.5 ).normalize()
    this.scene.add( directionalLight )

    const pointLight1 = new Mesh( new SphereGeometry( 4, 8, 8 ), new MeshBasicMaterial( { color: 0xc1c1c1 } ) )
    pointLight1.name = 'FrontLight'
    const light1 = new PointLight( 0xc1c1c1, 4.0, 300, 0 )
    light1.name = 'Point'
    pointLight1.add( light1 )
    this.scene.add( pointLight1 )
    pointLight1.position.x = 0
    pointLight1.position.y = - 50
    pointLight1.position.z = 350

    const pointLight2 = new Mesh( new SphereGeometry( 4, 8, 8 ), new MeshBasicMaterial( { color: 0xc1c100 } ) )
    pointLight2.name = 'BackLight'
    const light2 = new PointLight( 0xc1c100, 0.75, 500, 0 )
    light2.name = 'Point'
    pointLight2.add( light2 )
    this.scene.add( pointLight2 )
    pointLight2.position.x = - 100
    pointLight2.position.y = 20
    pointLight2.position.z = - 260

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})
    const loader = new TextureLoader().setPath( 'https://threejs.org/examples/models/fbx/' )
    const imgTexture = loader.load( 'white.jpg', onLoad )
    imgTexture.colorSpace = SRGBColorSpace

    const thicknessTexture = loader.load( 'bunny_thickness.jpg', onLoad )
    imgTexture.wrapS = imgTexture.wrapT = RepeatWrapping

    const material = new MeshSSSNodeMaterial()
    material.color = new Color( 1.0, 0.2, 0.2 )
    material.roughness = 0.3

    material.thicknessColorNode = texture( thicknessTexture ).mul( vec3( 0.5, 0.3, 0.0 ) )
    material.thicknessDistortionNode = this.distortionUniform
    material.thicknessAmbientNode = this.ambientUniform
    material.thicknessAttenuationNode = this.attenuationUniform
    material.thicknessPowerNode = this.powerUniform
    material.thicknessScaleNode = this.scaleUniform

    try {
      const object = await new FBXLoader().loadAsync( 'https://threejs.org/examples/models/fbx/stanford-bunny.fbx' )
      const model = object.children[ 0 ] as Mesh
      model.name = 'Bunny'
      model.position.set( 0, 0, 10 )
      model.scale.setScalar( 1 )
      model.material = material
      this.scene.add( model )
      this.model = model
      this.pose( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      this._frameTarget = model
    } catch ( e ) {
      console.error( e )
    }
  }

  distortionChanged() { this.distortionUniform.value = this.distortion }
  ambientChanged() { this.ambientUniform.value = this.ambient }
  attenuationChanged() { this.attenuationUniform.value = this.attenuation }
  powerChanged() { this.powerUniform.value = this.power }
  scaleChanged() { this.scaleUniform.value = this.scale }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    // The source turns the bunny by `performance.now() / 5000`.
    if ( this.model ) this.model.rotation.y = time / 5
  }
}

registerEditorConfig(MaterialsSssExample, [
  ['distortion', ioNumberSlider({min: 0.01, max: 1, step: 0.01})],
  ['ambient', ioNumberSlider({min: 0.01, max: 5, step: 0.05})],
  ['attenuation', ioNumberSlider({min: 0.01, max: 5, step: 0.05})],
  ['power', ioNumberSlider({min: 0.01, max: 16, step: 0.1})],
  ['scale', ioNumberSlider({min: 0.01, max: 50, step: 0.1})],
])

registerEditorGroups(MaterialsSssExample, {
  Main: ['distortion', 'ambient', 'attenuation', 'power', 'scale'],
})

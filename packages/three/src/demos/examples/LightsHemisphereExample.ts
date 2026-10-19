import {
  AnimationMixer,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry
} from 'three/webgpu'
import { float, max, mix, normalize, positionWorldDirection, pow, uniform, vec3 } from 'three/tsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The source's sky dome radius: the gradient is evaluated where its sphere would be. */
const SKY_RADIUS = 4000

/**
 * A flapping flamingo lit by a hemisphere light (sky blue above, warm ground below) and a shadow-casting sun, over a
 * warm ground in white fog. The source's sky dome `ShaderMaterial` is a background node with the same gradient, so the
 * 4000-unit dome does not dominate framing; the ground is unselectable and views frame the bird. Light helpers come from
 * the light helpers overlay. `hemisphereLight`, `directionalLight` and `shadowIntensity` are in the Document tab. Plays
 * when opened.
 */
@Register
export class LightsHemisphereExample extends Document {

  public hemiLight: HemisphereLight
  public dirLight: DirectionalLight
  public mixer?: AnimationMixer

  @Property({type: Boolean, value: true})
  declare hemisphereLight: boolean

  @Property({type: Boolean, value: true})
  declare directionalLight: boolean

  @Property({type: Number, value: 1})
  declare shadowIntensity: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: 1}), ...args})

    const camera = new PerspectiveCamera( 30, 400 / 250, 1, 5000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 250 )
    this.activeCamera = camera

    this.scene.background = new Color().setHSL( 0.6, 0, 1 )
    const fog = new Fog( this.scene.background, 1, 5000 )
    this.scene.fog = fog

    // LIGHTS

    this.hemiLight = new HemisphereLight( 0xffffff, 0xffffff, 2 )
    this.hemiLight.name = 'Hemisphere'
    this.hemiLight.color.setHSL( 0.6, 1, 0.6 )
    this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 )
    this.hemiLight.position.set( 0, 50, 0 )
    this.scene.add( this.hemiLight )

    //

    this.dirLight = new DirectionalLight( 0xffffff, 3 )
    this.dirLight.name = 'Sun'
    this.dirLight.color.setHSL( 0.1, 1, 0.95 )
    this.dirLight.position.set( - 1, 1.75, 1 )
    this.dirLight.position.multiplyScalar( 30 )
    this.scene.add( this.dirLight )

    this.dirLight.castShadow = true

    this.dirLight.shadow.mapSize.width = 2048
    this.dirLight.shadow.mapSize.height = 2048

    const d = 50

    this.dirLight.shadow.camera.left = - d
    this.dirLight.shadow.camera.right = d
    this.dirLight.shadow.camera.top = d
    this.dirLight.shadow.camera.bottom = - d

    this.dirLight.shadow.camera.far = 3500
    this.dirLight.shadow.bias = - 0.0001

    // GROUND

    const groundGeo = new PlaneGeometry( 10000, 10000 )
    const groundMat = new MeshLambertMaterial( { color: 0xffffff } )
    groundMat.color.setHSL( 0.095, 1, 0.75 )

    const ground = new Mesh( groundGeo, groundMat )
    ground.name = 'Ground'
    ground.position.y = - 33
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    // SKYDOME

    const topColor = uniform( new Color( 0x0077ff ).copy( this.hemiLight.color ) )
    const bottomColor = uniform( new Color( 0xffffff ) )
    const offset = float( 33 )
    const exponent = float( 0.6 )

    fog.color.copy( bottomColor.value )

    // float h = normalize( vWorldPosition + offset ).y, with vWorldPosition on the dome around the camera.
    const h = normalize( positionWorldDirection.mul( SKY_RADIUS ).add( vec3( offset ) ) ).y
    this.scene.backgroundNode = mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  hemisphereLightChanged() {
    if ( ! this.hemiLight ) return
    this.hemiLight.visible = this.hemisphereLight
    this.notify({kind: 'other'})
  }

  directionalLightChanged() {
    if ( ! this.dirLight ) return
    this.dirLight.visible = this.directionalLight
    this.notify({kind: 'other'})
  }

  shadowIntensityChanged() {
    if ( ! this.dirLight ) return
    this.dirLight.shadow.intensity = this.shadowIntensity
    this.notify({kind: 'other'})
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Flamingo.glb' )

      const mesh = gltf.scene.children[ 0 ] as Mesh

      const s = 0.35
      mesh.scale.set( s, s, s )
      mesh.position.y = 15
      mesh.rotation.y = - 1

      mesh.castShadow = true
      mesh.receiveShadow = true

      const model = new Group()
      model.name = 'Flamingo'
      model.add( mesh )
      this.scene.add( model )

      const clip = gltf.animations[ 0 ]
      this.mixer = new AnimationMixer( mesh )
      const action = this.mixer.clipAction( clip ).setDuration( 1 ).play()
      this.timeline.duration = clip.duration / action.timeScale
      this.mixer.setTime( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      model.updateMatrixWorld( true )
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number) {
    this.mixer?.update( delta )
  }
}

registerEditorConfig(LightsHemisphereExample, [
  ['shadowIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(LightsHemisphereExample, {
  Main: ['hemisphereLight', 'directionalLight', 'shadowIntensity'],
  Hidden: ['hemiLight', 'dirLight', 'mixer'],
})

import {
  AmbientLight,
  CubeTextureLoader,
  DoubleSide,
  Mesh,
  MeshStandardNodeMaterial,
  OrthographicCamera,
  PointLight,
  TextureLoader,
  Vector2
} from 'three/webgpu'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of one circle of the red light: the timeline length, so looping is seamless (the source turns 0.01 rad per frame). */
const PERIOD = 10 * Math.PI / 3

/**
 * A ninja head with displacement, normal and ambient occlusion maps and a cube map reflection, under a circling red
 * light. The material and light settings are in the Document tab. The source's orthographic camera is the active
 * camera, with its light (pink) on it. Plays when opened.
 */
@Register
export class MaterialsDisplacementmapExample extends Document {

  public material: MeshStandardNodeMaterial
  public pointLight: PointLight
  public ambientLight: AmbientLight

  @Property({type: Number, value: 1.0})
  declare metalness: number

  @Property({type: Number, value: 0.4})
  declare roughness: number

  @Property({type: Number, value: 1.0})
  declare aoIntensity: number

  @Property({type: Number, value: 0.2})
  declare ambient: number

  @Property({type: Number, value: 1.0})
  declare envIntensity: number

  @Property({type: Number, value: 2.436143}) // from original model
  declare displacement: number

  @Property({type: Number, value: 1.0})
  declare normalScale: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // lights

    this.ambientLight = new AmbientLight( 0xffffff, this.ambient )
    this.ambientLight.name = 'Ambient'
    this.scene.add( this.ambientLight )

    this.pointLight = new PointLight( 0xff0000, 1.5, 0, 0 )
    this.pointLight.name = 'Red'
    this.pointLight.position.z = 2500
    this.scene.add( this.pointLight )

    // The source's orthographic camera, 500 high, carrying the pink light.
    const height = 500
    const aspect = 400 / 250
    const camera = new OrthographicCamera( - height * aspect, height * aspect, height, - height, 1, 10000 )
    camera.name = 'Camera'
    camera.position.z = 1500
    this.scene.add( camera )
    this.activeCamera = camera

    const pointLight2 = new PointLight( 0xff6666, 3, 0, 0 )
    pointLight2.name = 'Pink'
    camera.add( pointLight2 )

    const pointLight3 = new PointLight( 0x0000ff, 1.5, 0, 0 )
    pointLight3.name = 'Blue'
    pointLight3.position.x = - 1000
    pointLight3.position.z = 1000
    this.scene.add( pointLight3 )

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    // textures

    const textureLoader = new TextureLoader().setPath( 'https://threejs.org/examples/models/obj/ninja/' )
    const normalMap = textureLoader.load( 'normal.png', onLoad )
    const aoMap = textureLoader.load( 'ao.jpg', onLoad )
    const displacementMap = textureLoader.load( 'displacement.jpg', onLoad )

    // material

    this.material = new MeshStandardNodeMaterial( {
      color: 0xc1c1c1,
      roughness: this.roughness,
      metalness: this.metalness,

      normalMap: normalMap,
      normalScale: new Vector2( 1, - 1 ), // why does the normal map require negation in this case?

      aoMap: aoMap,
      aoMapIntensity: 1,

      displacementMap: displacementMap,
      displacementScale: this.displacement,
      displacementBias: - 0.428408, // from original model

      envMapIntensity: this.envIntensity,

      side: DoubleSide
    } )

    void this.loadModel()

    this.pose( this.timeline.currentTime )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  /**
   * Adds the head once its environment map has loaded too. Workaround (upstream: triage-cube-envmap-loading): drawn
   * before, the standard material's environment binds a 2D placeholder as a cube texture and fails WebGPU validation
   * (the source races the same way).
   */
  private async loadModel() {
    try {
      // env map

      const path = 'https://threejs.org/examples/textures/cube/SwedishRoyalCastle/'
      const format = '.jpg'
      const urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
      ]

      const [ group, reflectionCube ] = await Promise.all( [
        new OBJLoader().loadAsync( 'https://threejs.org/examples/models/obj/ninja/ninjaHead_Low.obj' ),
        new CubeTextureLoader().loadAsync( urls ),
      ] )

      this.material.envMap = reflectionCube

      const geometry = ( group.children[ 0 ] as Mesh ).geometry
      geometry.center()

      const mesh = new Mesh( geometry, this.material )
      mesh.name = 'NinjaHead'
      mesh.scale.multiplyScalar( 25 )
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }

  metalnessChanged() { if ( this.material ) this.material.metalness = this.metalness }
  roughnessChanged() { if ( this.material ) this.material.roughness = this.roughness }
  aoIntensityChanged() { if ( this.material ) this.material.aoMapIntensity = this.aoIntensity }
  ambientChanged() { if ( this.ambientLight ) this.ambientLight.intensity = this.ambient }
  envIntensityChanged() { if ( this.material ) this.material.envMapIntensity = this.envIntensity }
  displacementChanged() { if ( this.material ) this.material.displacementScale = this.displacement }
  normalScaleChanged() { if ( this.material ) this.material.normalScale.set( 1, - 1 ).multiplyScalar( this.normalScale ) }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    const r = time / PERIOD * Math.PI * 2

    this.pointLight.position.x = 2500 * Math.cos( r )
    this.pointLight.position.z = 2500 * Math.sin( r )
  }
}

registerEditorConfig(MaterialsDisplacementmapExample, [
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['aoIntensity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['ambient', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['envIntensity', ioNumberSlider({min: 0, max: 3, step: 0.01})],
  ['displacement', ioNumberSlider({min: 0, max: 3, step: 0.01})],
  ['normalScale', ioNumberSlider({min: - 1, max: 1, step: 0.01})],
])

registerEditorGroups(MaterialsDisplacementmapExample, {
  Main: ['metalness', 'roughness', 'aoIntensity', 'ambient', 'envIntensity', 'displacement', 'normalScale'],
  Hidden: ['material', 'pointLight', 'ambientLight'],
})

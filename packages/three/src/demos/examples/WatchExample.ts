import {
  AdditiveBlending,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NeutralToneMapping,
  Object3D,
  PointLight
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { Register, Property } from '@io-gui/core'
import { Bloom, Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

const torad = Math.PI / 180

/** Seconds of one sweep of the second hand: the timeline length, so looping is seamless. */
const PERIOD = 60

/**
 * The time and date the watch shows at time 0: 10:10, the watchmakers' pose, a Saturday in October. The source reads
 * the wall clock; here the second hand ticks and the subdial turns with document time, and the rest holds.
 */
const HOUR = 10, MINUTE = 10, DAY = 6, MONTH = 9

/**
 * A Rolex in a studio HDR environment, with gold and silver parts, an iridescent glass and shadows. `roughness`,
 * `metalness` and `opacity` are in the Document tab. The hands follow document time from 10:10 (the source shows the
 * wall clock). The source's optional bloom (`postProcess`) is the document's `bloom`, off by default (its controls are
 * the Document tab's Bloom); its TAA is the TRAA views'. The camera tween is dropped. Plays when opened.
 */
@Register
export class WatchExample extends Document {

  public meshes: Record<string, Object3D> = {}
  private materials: Record<string, MeshStandardMaterial> = {}

  @Property({type: Number, value: 0.1})
  declare roughness: number

  @Property({type: Number, value: 1.0})
  declare metalness: number

  @Property({type: Number, value: 0.8})
  declare opacity: number

  constructor(args?: DocumentProps) {
    super({
      toneMapping: NeutralToneMapping,
      toneMappingExposure: 0.7,
      bloom: new Bloom({enabled: false, strength: 0.007, radius: 0.0, threshold: 0}),
      timeline: new Timeline({autoplay: true, duration: PERIOD}),
      ...args,
    })

    const dirLight = new DirectionalLight( 0xFFFFFF, 6 )
    dirLight.name = 'Key'
    dirLight.position.set( 0.2, 0.6, 0.4 )
    dirLight.castShadow = true
    this.scene.add( dirLight )

    const shadow = dirLight.shadow
    shadow.mapSize.width = shadow.mapSize.height = 2048
    shadow.radius = 8
    shadow.bias = - 0.0005

    const shadowCam = shadow.camera, s = 0.5
    shadowCam.near = 0.1
    shadowCam.far = 2
    shadowCam.right = shadowCam.top	= s
    shadowCam.left = shadowCam.bottom = - s

    const pointLight = new PointLight( 0x7b8cad, 1, 0, 2 )
    pointLight.name = 'Point'
    pointLight.position.set( - 0.3, - 0.2, - 0.2 )
    this.scene.add( pointLight )

    void this.load()
  }

  private async load() {
    try {
      const texture = await new HDRLoader().loadAsync( 'https://threejs.org/examples/textures/equirectangular/lobe.hdr' )

      texture.mapping = EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.environment = texture
      this.scene.backgroundBlurriness = 0.5
      this.scene.backgroundIntensity = 1.0
      this.scene.environmentIntensity = 1.5
      this.notify({kind: 'other'})

      // model

      const loader = new GLTFLoader()
      loader.setDRACOLoader( new DRACOLoader().setDecoderPath( DRACO_GLTF_CONFIG ) )
      const gltf = await loader.loadAsync( 'https://threejs.org/examples/models/gltf/rolex.glb' )

      const model = gltf.scene as Group
      model.name = 'Rolex'
      model.rotation.x = Math.PI * 0.25

      model.traverse( ( child ) => {

        const mesh = child as Mesh<Mesh['geometry'], MeshStandardMaterial>

        if ( mesh.isMesh || ( child as Group ).isGroup ) {

          if ( mesh.isMesh ) {

            mesh.material.vertexColors = false
            if ( this.materials[ mesh.material.name ] ) mesh.material = this.materials[ mesh.material.name ]
            else this.materials[ mesh.material.name ] = mesh.material

            if ( mesh.name !== 'glass' && mesh.name !== 'floor' ) {

              mesh.receiveShadow = true
              mesh.castShadow = true

            }

          }

          this.meshes[ child.name ] = child

        }

      } )

      const floor = this.meshes.floor
      if ( floor ) floor.userData.selectable = false

      this.scene.add( model );

      ( this.meshes.glass as Mesh ).material = new MeshPhysicalMaterial( {
        color: 0x020205,
        transparent: true, opacity: this.opacity,
        metalness: 0, roughness: 0,
        iridescence: 0.3,
        clearcoat: 1.0,
        blending: AdditiveBlending
      } )

      this.upMaterial()
      this.setTime( this.timeline.currentTime )

      this.notify({kind: 'structure'})
      // Frame the watch, not its floor.
      model.updateMatrixWorld( true )
      this.dispatch('frame-object', {object: model.children.filter( child => ! child.getObjectByName( 'floor' ) )}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  roughnessChanged() { this.upMaterial() }
  metalnessChanged() { this.upMaterial() }
  opacityChanged() { this.upMaterial() }

  private upMaterial() {
    const { Gold, Silver } = this.materials
    const glass = this.meshes?.glass as Mesh<Mesh['geometry'], MeshPhysicalMaterial> | undefined
    if ( ! Gold || ! Silver || ! glass ) return

    Gold.metalness = Silver.metalness = this.metalness
    Gold.roughness = Silver.roughness = this.roughness
    glass.material.opacity = this.opacity

    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    this.setTime( time )
  }

  /** Sets the hands for document `time` seconds after 10:10. */
  private setTime(time: number) {
    const meshes = this.meshes
    if ( ! meshes.second ) return

    const second = Math.floor( time )
    const milli = ( time - second ) * 1000

    meshes.hour.rotation.y = - HOUR * 30 * torad
    meshes.minute.rotation.y = - MINUTE * 6 * torad
    meshes.second.rotation.y = - second * 6 * torad
    meshes.mini_03.rotation.y = - DAY * 12 * torad
    meshes.mini_02.rotation.y = - MONTH * 30 * torad
    meshes.mini_01.rotation.y = - milli * 0.36 * torad
  }
}

registerEditorConfig(WatchExample, [
  ['roughness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['metalness', ioNumberSlider({min: 0, max: 1, step: 0.01})],
  ['opacity', ioNumberSlider({min: 0, max: 1, step: 0.01})],
])

registerEditorGroups(WatchExample, {
  Main: ['roughness', 'metalness', 'opacity'],
  Hidden: ['meshes', 'materials'],
})

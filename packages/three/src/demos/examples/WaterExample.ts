import {
  ACESFilmicToneMapping,
  Color,
  DoubleSide,
  EquirectangularReflectionMapping,
  Group,
  Mesh,
  MeshStandardMaterial,
  NodeUpdateType,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  TextureLoader,
  Vector2
} from 'three/webgpu'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { WaterMesh, type WaterNode } from 'three/addons/objects/Water2Mesh.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/addons/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** `WaterNode`'s flow: speed in offset per second, and the cycle of one flow map phase. */
const FLOW_SPEED = 0.03
const FLOW_CYCLE = 0.15

/** Seconds of one flow cycle (0.15 at 0.03 per second): the timeline length, so looping is seamless. */
const PERIOD = FLOW_CYCLE / FLOW_SPEED

/**
 * A pool filled with `WaterMesh` (Water2Mesh): a TSL `reflector()` reflection and a refraction of the view's own frame,
 * mixed by a Fresnel term and rippled by two flowing normal maps. `color`, `scale`, `flowX` and `flowY` are in the
 * Document tab. The flow is derived from document time (the node advances it per render by wall-clock delta). Bloom
 * and FXAA post are dropped (`document-pipeline`). The ground is unselectable. The source camera, low over the deck, is
 * the active camera. `WaterNode` adds a reflector target to the water each time it builds (once per view pipeline), so
 * the water has several unnamed children. Plays when opened.
 */
@Register
export class WaterExample extends Document {

  public water: WaterMesh
  private waterNode: WaterNode

  @Property({type: Color, init: null})
  declare color: Color

  @Property({type: Number, value: 2})
  declare scale: number

  @Property({type: Number, value: 1})
  declare flowX: number

  @Property({type: Number, value: 1})
  declare flowY: number

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, toneMappingExposure: 0.5, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    new UltraHDRLoader().load( 'https://threejs.org/examples/textures/equirectangular/moonless_golf_2k.hdr.jpg', ( texture ) => {
      texture.mapping = EquirectangularReflectionMapping
      texture.needsUpdate = true

      this.scene.background = texture
      this.scene.environment = texture
      this.notify({kind: 'material'})
    } )

    void this.loadModel()

    // The source looks across the water from low over the deck.
    const camera = new PerspectiveCamera( 45, 400 / 250, 0.1, 200 )
    camera.name = 'Camera'
    camera.position.set( - 20, 6, - 30 )
    camera.lookAt( 0, 0, - 5 )
    this.activeCamera = camera

    // water

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader()
    const onLoad = () => this.notify({kind: 'material'})

    const normalMap0 = textureLoader.load( 'https://threejs.org/examples/textures/water/Water_1_M_Normal.jpg', onLoad )
    const normalMap1 = textureLoader.load( 'https://threejs.org/examples/textures/water/Water_2_M_Normal.jpg', onLoad )

    normalMap0.wrapS = normalMap0.wrapT = RepeatWrapping
    normalMap1.wrapS = normalMap1.wrapT = RepeatWrapping

    const waterGeometry = new PlaneGeometry( 30, 40 )

    this.water = new WaterMesh( waterGeometry, {
      color: '#99e0ff',
      scale: 2,
      flowDirection: new Vector2( 1, 1 ),
      flowSpeed: FLOW_SPEED,
      normalMap0: normalMap0,
      normalMap1: normalMap1
    } )
    this.water.name = 'Water'
    this.water.position.set( 0, 0.2, - 2 )
    this.water.rotation.x = Math.PI * - 0.5
    this.water.renderOrder = Infinity
    this.scene.add( this.water )

    this.waterNode = this.water.material.colorNode as WaterNode
    // The flow follows document time (`pose`), not the renderer's per-render delta.
    this.waterNode.updateBeforeType = NodeUpdateType.NONE

    // floor

    const floorGeometry = new PlaneGeometry( 1, 1 )
    floorGeometry.rotateX( - Math.PI * 0.5 )
    const floorMaterial = new MeshStandardMaterial( {
      color: 0x444444,
      roughness: 1,
      metalness: 0,
      side: DoubleSide
    } )

    const ground = new Group()
    ground.name = 'Ground'
    ground.userData.selectable = false
    this.scene.add( ground )

    for ( const [ x, z, width, depth ] of [ [ 20, 0, 15, 80 ], [ - 20, 0, 15, 80 ], [ 0, 30, 30, 20 ], [ 0, - 30, 30, 20 ] ] ) {
      const floor = new Mesh( floorGeometry, floorMaterial )
      floor.name = 'Floor'
      floor.position.set( x, 0, z )
      floor.scale.set( width, 1, depth )
      ground.add( floor )
    }

    this.color.copy( this.waterNode.color.value )
    this.pose( this.timeline.currentTime )
  }

  private async loadModel() {
    try {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath( DRACO_GLTF_CONFIG )

      const gltfLoader = new GLTFLoader()
      gltfLoader.setDRACOLoader( dracoLoader )

      const gltf = await gltfLoader.loadAsync( 'https://threejs.org/examples/models/gltf/pool.glb' )
      gltf.scene.name = 'Pool'
      gltf.scene.position.z = 2
      gltf.scene.scale.setScalar( 0.1 )
      this.scene.add( gltf.scene )

      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  colorChanged() {
    this.colorMutated()
  }

  /** The color editor changes the color in place. */
  colorMutated() {
    if ( ! this.waterNode ) return
    this.waterNode.color.value.copy( this.color )
    this.notify({kind: 'material'})
  }

  scaleChanged() { if ( this.waterNode ) this.waterNode.scale.value = this.scale }

  flowXChanged() { this.updateFlowDirection() }
  flowYChanged() { this.updateFlowDirection() }

  private updateFlowDirection() {
    if ( ! this.waterNode ) return
    this.waterNode.flowDirection.value.set( this.flowX, this.flowY ).normalize()
    this.notify({kind: 'material'})
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** `WaterNode.updateFlow` at `time`: two flow map offsets half a cycle apart, each in [ 0, cycle ). */
  private pose(time: number) {
    const halfCycle = FLOW_CYCLE * 0.5
    const offset0 = ( FLOW_SPEED * time ) % FLOW_CYCLE
    this.waterNode.flowConfig.value.set( offset0, ( offset0 + halfCycle ) % FLOW_CYCLE, halfCycle )
  }
}

registerEditorConfig(WaterExample, [
  ['scale', ioNumberSlider({min: 1, max: 10, step: 0.01})],
  ['flowX', ioNumberSlider({min: - 1, max: 1, step: 0.01})],
  ['flowY', ioNumberSlider({min: - 1, max: 1, step: 0.01})],
])

registerEditorGroups(WaterExample, {
  Main: ['color', 'scale', 'flowX', 'flowY'],
  Hidden: ['water', 'waterNode'],
})

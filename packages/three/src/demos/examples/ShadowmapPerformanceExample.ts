import {
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  AnimationObjectGroup,
  BoxGeometry,
  BufferGeometry,
  Color,
  DirectionalLight,
  Fog,
  Group,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  WebGPURenderer
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024

const FLOOR = - 250

const ANIMATION_GROUPS = 25

const NEAR = 5, FAR = 3000

/** Horse speed in units per second. */
const SPEED = 550

/** The source respawns a horse past x = 2000 at x = -1000 minus up to 500; here the run is a fixed 3000 units. */
const RUN_START = - 1000
const RUN_LENGTH = 3000

/** Seconds in which the herd repeats: eleven runs of 3000 units at 550 units per second. The timeline length. */
const PERIOD = 11 * RUN_LENGTH / SPEED

/**
 * 601 galloping horses (morph animation shared through 25 `AnimationObjectGroup`s) crossing a shadowed floor past
 * 3D text, under one shadow-casting directional light, as at HEAD (r186 used a `SunLight`). The horses' runs are
 * derived from document time and their gallop advances by `delta`. `FirstPersonControls` are dropped: the source camera
 * is kept as `Camera`, and views frame the blocks (the 10000-unit floor lies beyond the fog). Plays when opened.
 */
@Register
export class ShadowmapPerformanceExample extends Document {

  public herd: Group
  public mixer: AnimationMixer
  private cubes: Mesh
  /** Each horse's x at time 0. */
  private starts: number[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    // CAMERA

    const camera = new PerspectiveCamera( 23, 1, NEAR, FAR )
    camera.name = 'Camera'
    camera.position.set( 700, 50, 1900 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )

    // SCENE

    this.scene.background = new Color( 0x59472b )
    this.scene.fog = new Fog( 0x59472b, 1000, FAR )

    // LIGHTS

    const ambient = new AmbientLight( 0xffffff )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    const light = new DirectionalLight( 0xffffff, 3 )
    light.name = 'Key'
    light.position.set( 0, 1500, 1000 )
    light.castShadow = true
    light.shadow.camera.top = 2000
    light.shadow.camera.bottom = - 2000
    light.shadow.camera.left = - 2000
    light.shadow.camera.right = 2000
    light.shadow.camera.near = 1200
    light.shadow.camera.far = 2500
    light.shadow.bias = 0.0001

    light.shadow.mapSize.width = SHADOW_MAP_WIDTH
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT

    this.scene.add( light )

    // GROUND

    const geometry = new PlaneGeometry( 100, 100 )
    const planeMaterial = new MeshPhongMaterial( { color: 0xffdd99 } )

    const ground = new Mesh( geometry, planeMaterial )
    ground.name = 'Ground'
    ground.position.set( 0, FLOOR, 0 )
    ground.rotation.x = - Math.PI / 2
    ground.scale.set( 100, 100, 100 )

    ground.castShadow = false
    ground.receiveShadow = true
    ground.userData.selectable = false

    this.scene.add( ground )

    // CUBES

    const cubes1 = new Mesh( new BoxGeometry( 1500, 220, 150 ), planeMaterial )
    cubes1.name = 'Block 1'

    cubes1.position.y = FLOOR - 50
    cubes1.position.z = 20

    cubes1.castShadow = true
    cubes1.receiveShadow = true

    this.scene.add( cubes1 )

    const cubes2 = new Mesh( new BoxGeometry( 1600, 170, 250 ), planeMaterial )
    cubes2.name = 'Block 2'

    cubes2.position.y = FLOOR - 50
    cubes2.position.z = 20

    cubes2.castShadow = true
    cubes2.receiveShadow = true

    this.scene.add( cubes2 )
    this.cubes = cubes2

    this.herd = new Group()
    this.herd.name = 'Herd'
    this.scene.add( this.herd )

    this.mixer = new AnimationMixer( this.scene )

    void this.loadText()
    void this.loadHorses()
  }

  /** Whole-scene framing would stand beyond the fog: frame the blocks once the document is on screen. */
  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    this.dispatch('frame-object', {object: this.cubes}, true)
  }

  private async loadText() {
    try {
      const font = await new FontLoader().loadAsync( 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json' )

      const textGeo = new TextGeometry( 'THREE.JS', {

        font: font,

        size: 200,
        depth: 50,
        curveSegments: 12,

        bevelThickness: 2,
        bevelSize: 5,
        bevelEnabled: true

      } )

      textGeo.computeBoundingBox()
      const centerOffset = - 0.5 * ( textGeo.boundingBox!.max.x - textGeo.boundingBox!.min.x )

      const textMaterial = new MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } )

      const mesh = new Mesh( textGeo, textMaterial )
      mesh.name = 'Text'
      mesh.position.x = centerOffset
      mesh.position.y = FLOOR + 67

      mesh.castShadow = true
      mesh.receiveShadow = true

      this.scene.add( mesh )
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  private async loadHorses() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Horse.glb' )

      const mesh = gltf.scene.children[ 0 ] as Mesh<BufferGeometry, MeshStandardMaterial>
      const clip = gltf.animations[ 0 ]

      const animGroups: AnimationObjectGroup[] = []

      for ( let i = 0; i !== ANIMATION_GROUPS; ++ i ) {

        animGroups.push( new AnimationObjectGroup() )

      }

      for ( let i = - 600; i < 601; i += 2 ) {

        this.addMorph( mesh, clip, animGroups, 1, 100 - Math.random() * 3000, FLOOR, i )

      }

      this.pose( this.timeline.currentTime )
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  // MORPHS

  private addMorph(source: Mesh<BufferGeometry, MeshStandardMaterial>, clip: AnimationClip, animGroups: AnimationObjectGroup[], duration: number, x: number, y: number, z: number) {

    // The clone keeps the source's name: the clip's morph track addresses it.
    const mesh = source.clone()
    mesh.material = source.material.clone()

    mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 )

    const index = Math.floor( Math.random() * ANIMATION_GROUPS ),
      animGroup = animGroups[ index ]

    animGroup.add( mesh )

    if ( ! this.mixer.existingAction( clip, animGroup ) ) {

      const randomness = 0.6 * Math.random() - 0.3
      const phase = ( index + randomness ) / ANIMATION_GROUPS

      this.mixer.clipAction( clip, animGroup ).
        setDuration( duration ).
        startAt( - duration * phase ).
        play()

    }

    mesh.position.set( x, y, z )
    mesh.rotation.y = Math.PI / 2

    mesh.castShadow = true
    mesh.receiveShadow = true

    this.herd.add( mesh )
    this.starts.push( x )

  }

  override onAnimate(delta: number, time: number) {
    this.mixer.update( delta )
    this.pose( time )
  }

  /** Places each horse along its run for document `time`. */
  private pose(time: number) {
    const horses = this.herd.children

    for ( let i = 0; i < horses.length; i ++ ) {

      const travelled = this.starts[ i ] - RUN_START + SPEED * time
      horses[ i ].position.x = RUN_START + ( ( travelled % RUN_LENGTH ) + RUN_LENGTH ) % RUN_LENGTH

    }
  }
}

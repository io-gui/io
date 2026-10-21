import {
  ACESFilmicToneMapping,
  AnimationClip,
  AnimationMixer,
  CircleGeometry,
  DirectionalLight,
  Fog,
  HemisphereLight,
  Mesh,
  MeshToonNodeMaterial,
  NearestFilter,
  Node,
  Object3D,
  PerspectiveCamera,
  TextureLoader,
  Vector3
} from 'three/webgpu'
import { Fn, bool, clamp, cameraPosition, positionWorld, screenCoordinate, smoothstep, uniform } from 'three/tsl'
import { bayer16 } from 'three/addons/tsl/math/Bayer.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

const walkRadius = 3.8
const walkSpeed = 0.35

/** Seconds of one loop: one walk around the circle (0.35 rad/s). The walk cycle (0.97 s) does not divide it, so the stride jumps at the wrap. */
const PERIOD = 2 * Math.PI / walkSpeed

const characterColors: Record<string, string> = { 'Beta_Joints': '#2a2d33', 'Beta_Surface': '#ff5a1f' }

/**
 * A toon-shaded character walks in a circle of walls and pillars, and the walls between the drawing camera and the
 * character dither away: a cone from `cameraPosition` to the character (`radius`, ending `stopDistance` before it)
 * cuts each wall's fragments with a Bayer 16 × 16 threshold (`ditherScale` pixels per cell), while their shadows stay
 * whole (`maskShadowNode`). Each view cuts the cone from its own camera. The walk is derived from time; the source's
 * `paused` is the editor's transport. Plays when opened.
 */
@Register
export class TslOcclusionDitherExample extends Document {

  @Property({type: Number, value: 1.6})
  declare radius: number

  @Property({type: Number, value: 0.5})
  declare stopDistance: number

  @Property({type: Number, value: 1})
  declare ditherScale: number

  public model: Object3D | null = null
  public walls: Mesh[] = []
  public mixer: AnimationMixer = new AnimationMixer( new Object3D() )
  private targetUniform = uniform( new Vector3( walkRadius, 1, 0 ) )
  private radiusUniform = uniform( 1.6 )
  private stopDistanceUniform = uniform( 0.5 )
  private ditherScaleUniform = uniform( 1 )

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 40, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 4, 7, 14 )
    camera.lookAt( 0, 1, 0 )
    this.activeCamera = camera

    const fog = new Fog( '#c4d0dd', 20, 50 )
    this.scene.fog = fog
    this.scene.background = fog.color

    // lights

    const sun = new DirectionalLight( '#ffffff', 3 )
    sun.name = 'Sun'
    sun.position.set( - 8, 10, 6 )
    sun.castShadow = true
    sun.shadow.mapSize.set( 2048, 2048 )
    sun.shadow.camera.left = - 8
    sun.shadow.camera.right = 8
    sun.shadow.camera.top = 8
    sun.shadow.camera.bottom = - 8
    sun.shadow.camera.near = 6
    sun.shadow.camera.far = 25
    sun.shadow.intensity = 0.8
    sun.shadow.radius = 2.5
    sun.shadow.normalBias = 0.03
    this.scene.add( sun )

    const hemisphereLight = new HemisphereLight( '#b4c9e4', '#ffffff', 1.5 )
    hemisphereLight.name = 'Hemisphere Light'
    this.scene.add( hemisphereLight )

    // occlusion cone from the camera to the target

    const target = this.targetUniform
    const radius = this.radiusUniform
    const stopDistance = this.stopDistanceUniform

    const occlusionCut = Fn( () => {
      const toTarget = target.sub( cameraPosition )
      const t = positionWorld.sub( cameraPosition ).dot( toTarget ).div( toTarget.dot( toTarget ) ).toConst()
      const progress = clamp( t ).toConst()
      const closest = cameraPosition.add( toTarget.mul( progress ) )
      const coneRadius = radius.mul( progress.mul( 0.75 ).add( 0.25 ) )
      const inside = smoothstep( coneRadius.mul( 0.5 ), coneRadius, positionWorld.distance( closest ) ).oneMinus()
      const inFront = t.lessThan( stopDistance.div( toTarget.length() ).oneMinus() )
      return inFront.select( inside, 0 )
    } )()

    // dither
    // remap to [0, 1) so a full cut removes every fragment ( @types/three 0.186 types bayer16() as an untyped Node )
    const threshold = ( bayer16( screenCoordinate.div( this.ditherScaleUniform ) ) as Node<'vec4'> ).r.mul( 255 / 256 )

    // materials

    const gradientMap = new TextureLoader().load( 'https://threejs.org/examples/textures/gradientMaps/threeTone.jpg', () => this.notify({kind: 'material'}) )
    gradientMap.minFilter = NearestFilter
    gradientMap.magFilter = NearestFilter
    gradientMap.generateMipmaps = false

    const wallParameters = {
      gradientMap,
      maskNode: threshold.greaterThanEqual( occlusionCut ),
      maskShadowNode: bool( true ) // keep full shadows
    }

    const wallMaterials = [ '#9fb2c6', '#8aa0b8', '#b3c2d2' ].map( ( color ) => new MeshToonNodeMaterial( { ...wallParameters, color } ) )
    const pillarMaterial = new MeshToonNodeMaterial( { ...wallParameters, color: '#5f7690' } )

    // walls

    const addWall = ( name: string, x: number, z: number, width: number, height: number, depth: number, rotation: number, material: MeshToonNodeMaterial ) => {
      const wall = new Mesh( new RoundedBoxGeometry( width, height, depth, 3, 0.12 ), material )
      wall.name = name
      wall.position.set( x, height / 2, z )
      wall.rotation.y = rotation
      wall.castShadow = true
      wall.receiveShadow = true
      this.scene.add( wall )
      this.walls.push( wall )
    }

    const heights = [ 3.2, 4.4, 3.6, 5.0, 3.0, 4.2, 3.4, 4.8, 3.8, 3.1, 4.6, 3.5 ]

    for ( let i = 0; i < heights.length; i ++ ) {
      const angle = ( i / heights.length ) * Math.PI * 2
      addWall( 'Wall', Math.cos( angle ) * 6.5, Math.sin( angle ) * 6.5, 2.6, heights[ i ], 0.6, Math.PI / 2 - angle, wallMaterials[ i % wallMaterials.length ] )
    }

    for ( let i = 0; i < 5; i ++ ) {
      const angle = ( i / 5 ) * Math.PI * 2 + 0.3
      addWall( 'Pillar', Math.cos( angle ) * 1.6, Math.sin( angle ) * 1.6, 0.8, 4, 0.8, - angle, pillarMaterial )
    }

    // ground

    const ground = new Mesh( new CircleGeometry( 50, 64 ), new MeshToonNodeMaterial( { color: '#c4d0dd', gradientMap } ) )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.receiveShadow = true
    ground.userData.selectable = false
    this.scene.add( ground )

    void this.loadCharacter( gradientMap )
  }

  /** The ground dwarfs the walls. */
  override getEditorFrameTarget() {
    return this.walls
  }

  private async loadCharacter( gradientMap: MeshToonNodeMaterial['gradientMap'] ) {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Xbot.glb' )
      const model = gltf.scene

      model.traverse( ( child ) => {
        const mesh = child as Mesh
        if ( mesh.isMesh ) {
          mesh.castShadow = true
          mesh.material = new MeshToonNodeMaterial( { color: characterColors[ mesh.name ], gradientMap } )
        }
      } )

      this.scene.add( model )
      this.model = model

      this.mixer = new AnimationMixer( model )
      this.mixer.clipAction( AnimationClip.findByName( gltf.animations, 'walk' )! ).play()

      this.pose( this.timeline.currentTime )
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  radiusChanged() { this.radiusUniform.value = this.radius }
  stopDistanceChanged() { this.stopDistanceUniform.value = this.stopDistance }
  ditherScaleChanged() { this.ditherScaleUniform.value = this.ditherScale }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  /** The source integrates the walk; here it is derived from time, so scrubbing shows it exactly. */
  private pose(time: number) {
    const model = this.model
    if ( ! model ) return

    const walkAngle = time * walkSpeed
    model.position.set( Math.cos( walkAngle ) * walkRadius, 0, Math.sin( walkAngle ) * walkRadius )
    model.rotation.y = - walkAngle
    this.mixer.setTime( time )
    this.targetUniform.value.copy( model.position ).y += 1
  }
}

registerEditorConfig(TslOcclusionDitherExample, [
  ['radius', ioNumberSlider({min: 0.5, max: 3, step: 0.01})],
  ['stopDistance', ioNumberSlider({min: 0, max: 5, step: 0.01})],
  ['ditherScale', ioNumberSlider({min: 1, max: 8, step: 1})],
])

registerEditorGroups(TslOcclusionDitherExample, {
  Main: ['radius', 'stopDistance', 'ditherScale'],
  Hidden: ['model', 'walls', 'mixer', 'targetUniform', 'radiusUniform', 'stopDistanceUniform', 'ditherScaleUniform'],
})

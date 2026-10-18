import {
  AmbientLight,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  Group,
  InstancedMesh,
  Material,
  Matrix4,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  PointLight,
  TorusKnotGeometry,
  Vector3
} from 'three/webgpu'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds in which the motion repeats: the timeline length. The garden sways with `sin( t / 4 )` and `sin( t / 2 )`. */
const PERIOD = 8 * Math.PI

/**
 * Lives per flower per loop, so looping is seamless: a life lasts π s (source: 0.005 of a life per frame, 3.3 s at 60
 * fps).
 */
const LIVES = 8

const maxCount = 2000

/** `MeshSurfaceSampler.setRandomGenerator`, missing from the typings. */
type SeededSampler = MeshSurfaceSampler & { setRandomGenerator( randomFunction: () => number ): MeshSurfaceSampler }

// Source: https://gist.github.com/gre/1650294
const easeOutCubic = function ( t: number ) {

  return ( -- t ) * t * t + 1

}

// Scaling curve causes particles to grow quickly, ease gradually into full scale, then
// disappear quickly. More of the particle's lifetime is spent around full scale.
const scaleCurve = function ( t: number ) {

  return Math.abs( easeOutCubic( ( t > 0.5 ? 1 - t : t ) * 2 ) )

}

/** A small seeded generator (mulberry32). */
function mulberry32( seed: number ) {
  return function () {
    seed |= 0
    seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul( seed ^ seed >>> 15, 1 | seed )
    t = t + Math.imul( t ^ t >>> 7, 61 | t ) ^ t
    return ( ( t ^ t >>> 14 ) >>> 0 ) / 4294967296
  }
}

const dummy = new Object3D()
const _position = new Vector3()
const _normal = new Vector3()
const _matrix = new Matrix4()

/**
 * 2000 flowers scattered on a torus knot with `MeshSurfaceSampler`: each grows, blooms and shrinks, then sprouts again
 * elsewhere. Lives are derived from document time, and each life samples its spot from a seeded generator, so scrubbing
 * and looping show the same garden. `count`, `distribution` (uniform or weighted by uv) and `resample` (new spots) are in
 * the Document tab. Plays when opened.
 */
@Register
export class InstancingScatterExample extends Document {

  public garden: Group
  public surface: Mesh<BufferGeometry, MeshLambertMaterial>
  public stemMesh?: InstancedMesh
  public blossomMesh?: InstancedMesh

  @Property({type: Number, value: maxCount})
  declare count: number

  @Property({type: String, value: 'random'})
  declare distribution: string

  /** Scatters the flowers anew. */
  resample = () => {
    this.seed = Math.floor( Math.random() * 0x7fffffff )
    this.lives.fill( - 1 )
    this.pose( this.timeline.currentTime )
    this.notify({kind: 'geometry'})
  }

  private sampler?: SeededSampler
  /** Each flower's age at time 0. */
  private ages = new Float32Array( maxCount )
  /** The life each flower's matrix was sampled for, or -1. */
  private lives = new Int32Array( maxCount ).fill( - 1 )
  /** Each flower's matrix at full scale for its current life. */
  private matrices: Matrix4[] = []
  private seed = Math.floor( Math.random() * 0x7fffffff )
  private random = mulberry32( 0 )

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0xE39469 )

    const pointLight = new PointLight( 0xAA8899, 2.5, 0, 0 )
    pointLight.name = 'Point'
    pointLight.position.set( 50, - 25, 75 )
    this.scene.add( pointLight )

    const ambientLight = new AmbientLight( 0xffffff, 3 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    this.garden = new Group()
    this.garden.name = 'Garden'
    this.scene.add( this.garden )

    // let surfaceGeometry = new BoxGeometry( 10, 10, 10 ).toNonIndexed();
    const surfaceGeometry = new TorusKnotGeometry( 10, 3, 100, 16 ).toNonIndexed()
    const surfaceMaterial = new MeshLambertMaterial( { color: 0xFFF784, wireframe: false } )
    this.surface = new Mesh( surfaceGeometry, surfaceMaterial )
    this.surface.name = 'Surface'
    this.garden.add( this.surface )

    for ( let i = 0; i < maxCount; i ++ ) {
      this.ages[ i ] = Math.random()
      this.matrices.push( new Matrix4() )
    }

    this.buildSampler()

    void this.loadFlower()
  }

  countChanged() {
    if ( ! this.stemMesh || ! this.blossomMesh ) return
    this.stemMesh.count = this.count
    this.blossomMesh.count = this.count
    this.notify({kind: 'geometry'})
  }

  distributionChanged() {
    if ( ! this.surface ) return
    this.buildSampler()
    this.lives.fill( - 1 )
    this.pose( this.timeline.currentTime )
    this.notify({kind: 'geometry'})
  }

  private buildSampler() {
    this.sampler = new MeshSurfaceSampler( this.surface )
      .setWeightAttribute( this.distribution === 'weighted' ? 'uv' : null )
      .build() as SeededSampler
    this.sampler.setRandomGenerator( () => this.random() )
  }

  private async loadFlower() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/Flower/Flower.glb' )

      const _stemMesh = gltf.scene.getObjectByName( 'Stem' ) as Mesh<BufferGeometry, Material>
      const _blossomMesh = gltf.scene.getObjectByName( 'Blossom' ) as Mesh<BufferGeometry, Material>

      const stemGeometry = _stemMesh.geometry.clone()
      const blossomGeometry = _blossomMesh.geometry.clone()

      const defaultTransform = new Matrix4()
        .makeRotationX( Math.PI )
        .multiply( new Matrix4().makeScale( 7, 7, 7 ) )

      stemGeometry.applyMatrix4( defaultTransform )
      blossomGeometry.applyMatrix4( defaultTransform )

      const stemMesh = new InstancedMesh( stemGeometry, _stemMesh.material, maxCount )
      stemMesh.name = 'Stems'
      const blossomMesh = new InstancedMesh( blossomGeometry, _blossomMesh.material, maxCount )
      blossomMesh.name = 'Blossoms'

      // Assign random colors to the blossoms.
      const color = new Color()
      const blossomPalette = [ 0xF20587, 0xF2D479, 0xF2C879, 0xF2B077, 0xF24405 ]

      for ( let i = 0; i < maxCount; i ++ ) {

        color.setHex( blossomPalette[ Math.floor( Math.random() * blossomPalette.length ) ] )
        blossomMesh.setColorAt( i, color )

      }

      // Instance matrices will be updated every frame.
      stemMesh.instanceMatrix.setUsage( DynamicDrawUsage )
      blossomMesh.instanceMatrix.setUsage( DynamicDrawUsage )

      stemMesh.count = this.count
      blossomMesh.count = this.count

      this.stemMesh = stemMesh
      this.blossomMesh = blossomMesh
      this.garden.add( stemMesh, blossomMesh )

      this.pose( this.timeline.currentTime )
      this.notify({kind: 'structure'})
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.garden.rotation.x = Math.sin( time / 4 )
    this.garden.rotation.y = Math.sin( time / 2 )

    const stemMesh = this.stemMesh
    const blossomMesh = this.blossomMesh
    if ( ! stemMesh || ! blossomMesh ) return

    const lives = time / PERIOD * LIVES

    for ( let i = 0; i < maxCount; i ++ ) {

      const age = this.ages[ i ] + lives
      const life = ( ( Math.floor( age ) % LIVES ) + LIVES ) % LIVES
      const scale = scaleCurve( age - Math.floor( age ) )

      if ( this.lives[ i ] !== life ) {
        this.lives[ i ] = life
        this.sampleFlower( i, life )
      }

      _matrix.copy( this.matrices[ i ] ).scale( _position.setScalar( scale ) )

      stemMesh.setMatrixAt( i, _matrix )
      blossomMesh.setMatrixAt( i, _matrix )

    }

    stemMesh.instanceMatrix.needsUpdate = true
    blossomMesh.instanceMatrix.needsUpdate = true

    stemMesh.computeBoundingSphere()
    blossomMesh.computeBoundingSphere()
  }

  /** Samples flower `i`'s spot for `life`, the same each time for the same seed. */
  private sampleFlower(i: number, life: number) {
    this.random = mulberry32( this.seed ^ Math.imul( i + 1, 0x9E3779B1 ) ^ Math.imul( life + 1, 0x85EBCA77 ) )

    this.sampler!.sample( _position, _normal )
    _normal.add( _position )

    dummy.position.copy( _position )
    dummy.scale.set( 1, 1, 1 )
    dummy.lookAt( _normal )
    dummy.updateMatrix()

    this.matrices[ i ].copy( dummy.matrix )
  }
}

registerEditorConfig(InstancingScatterExample, [
  ['count', ioNumberSlider({min: 0, max: maxCount, step: 1})],
  ['distribution', ioOptionSelect({model: new Menu({options: [ 'random', 'weighted' ]})})],
])

registerEditorGroups(InstancingScatterExample, {
  Main: ['count', 'distribution', 'resample'],
  Hidden: ['garden', 'surface', 'stemMesh', 'blossomMesh', 'sampler', 'ages', 'lives', 'matrices', 'seed', 'random'],
})

import {
  AmbientLight,
  Box3,
  Color,
  FogExp2,
  InstancedMesh,
  Mesh,
  MeshStandardMaterial,
  MeshStandardNodeMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Sphere,
  SpotLight,
  SpriteNodeMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3
} from 'three/webgpu'
import { float, range, texture, mix, uv, color, rotateUV, positionLocal, uniform } from 'three/tsl'
import { softParticles } from 'three/addons/tsl/utils/SoftParticles.js'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** Seconds of playback. Each particle has its own life length, so the loop jumps at the wrap. */
const DURATION = 20

/**
 * Smoke sprites around Lucy that fade where they meet the scene's depth (`softParticles`), instead of cutting hard
 * edges into the ground and the statue. `soft`, `softDistance` and `softContrast` are in the Document tab. The fade
 * converts depth with the perspective formula, so orthographic views fade wrong. The sprites are an `InstancedMesh`
 * with identity instance matrices and the plume's bounds, so framing and culling see it (the source draws a `Sprite`
 * with `count`). Plays when opened.
 */
@Register
export class ParticlesSoftExample extends Document {

  private softEnabled = uniform( 1 ) // 0 = hard particles, 1 = soft particles
  private softDistanceUniform = uniform( 1 ) // world-space fade distance
  private softContrastUniform = uniform( 2 )

  @Property({type: Boolean, value: true})
  declare soft: boolean

  @Property({type: Number, value: 1})
  declare softDistance: number

  @Property({type: Number, value: 2})
  declare softContrast: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: DURATION}), ...args})

    const camera = new PerspectiveCamera( 60, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 6, 8, 8 )
    camera.lookAt( 0, 4, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )
    this.scene.fog = new FogExp2( 0x000000, 0.025 )

    // lights

    const ambient = new AmbientLight( 0xffffff, 0.25 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    const spotLight = new SpotLight( 0xffffff, 800 )
    spotLight.name = 'Spot'
    spotLight.position.set( 10, 15, 8 )
    spotLight.target.position.set( 0, 4, 0 )
    spotLight.angle = 0.5
    spotLight.penumbra = 0.7
    spotLight.distance = 0
    this.scene.add( spotLight )

    void this.loadModel()

    const groundMaterial = new MeshStandardNodeMaterial( { color: 0x444444, roughness: 1 } )
    const ground = new Mesh( new PlaneGeometry( 100, 100 ), groundMaterial )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    ground.userData.selectable = false
    this.scene.add( ground )

    // smoke texture

    // Views draw on document changes only, so report the texture when it arrives.
    const map = new TextureLoader().load( 'https://threejs.org/examples/textures/opengameart/smoke1.png', () => this.notify({kind: 'material'}) )
    map.colorSpace = SRGBColorSpace

    // simple smoke particle system

    const lifeRange = range( 0.1, 1 )
    const offsetRange = range( new Vector3( - 2, 0, - 2 ), new Vector3( 2, 7, 2 ) )

    const speed = float( 0.2 )
    const scaledTime = this.timeline.timeNode.add( 20 ).mul( speed )

    const lifeTime = scaledTime.mul( lifeRange ).mod( 1 )
    const scaleRange = range( 6, 8 )
    const rotateRange = range( 0.1, 2 )

    const life = lifeTime.div( lifeRange )

    const textureNode = texture( map, rotateUV( uv(), scaledTime.mul( rotateRange ) ) )

    const fade = life.smoothstep( 0, 0.3 ).mul( life.smoothstep( 1, 0.7 ) )

    // soft particles

    const baseOpacity = textureNode.a.mul( fade )

    const smokeOpacity = mix( baseOpacity, softParticles( {
      opacity: baseOpacity,
      distance: this.softDistanceUniform,
      contrast: this.softContrastUniform
    } ), this.softEnabled )

    const smokeColor = mix( color( 0x6f6f6f ), color( 0x303030 ), positionLocal.y.mul( 0.1 ).clamp() )

    // instanced sprites

    const smokeMaterial = new SpriteNodeMaterial()
    smokeMaterial.colorNode = smokeColor
    smokeMaterial.opacityNode = smokeOpacity
    smokeMaterial.positionNode = offsetRange.mul( lifeTime )
    smokeMaterial.scaleNode = scaleRange.mul( lifeTime.max( 0.3 ) )
    smokeMaterial.depthWrite = false

    const smoke = new InstancedMesh( new PlaneGeometry( 1, 1 ), smokeMaterial, 50 )
    smoke.name = 'Smoke'
    // Positions up to (±2, 7, ±2), sprites up to 8 wide.
    smoke.boundingBox = new Box3( new Vector3( - 6, - 4, - 6 ), new Vector3( 6, 11, 6 ) )
    smoke.boundingSphere = smoke.boundingBox.getBoundingSphere( new Sphere() )
    this.scene.add( smoke )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const geometry = await new PLYLoader().loadAsync( 'https://threejs.org/examples/models/ply/binary/Lucy100k.ply' )
      geometry.computeVertexNormals()

      const material = new MeshStandardMaterial( )
      const mesh = new Mesh( geometry, material )
      mesh.name = 'Lucy'
      mesh.position.y = 4
      mesh.rotation.y = Math.PI
      mesh.scale.multiplyScalar( 0.005 )
      this.scene.add( mesh )

      this.notify({kind: 'structure'})
      // The 100-unit ground would dominate whole-scene framing.
      this._frameTarget = mesh
    } catch ( e ) {
      console.error( e )
    }
  }

  softChanged() { this.softEnabled.value = this.soft ? 1 : 0 }
  softDistanceChanged() { this.softDistanceUniform.value = this.softDistance }
  softContrastChanged() { this.softContrastUniform.value = this.softContrast }
}

registerEditorConfig(ParticlesSoftExample, [
  ['softDistance', ioNumberSlider({min: 0.1, max: 2, step: 0.01})],
  ['softContrast', ioNumberSlider({min: 1, max: 6, step: 0.01})],
])

registerEditorGroups(ParticlesSoftExample, {
  Main: ['soft', 'softDistance', 'softContrast'],
  Hidden: ['softEnabled', 'softDistanceUniform', 'softContrastUniform'],
})

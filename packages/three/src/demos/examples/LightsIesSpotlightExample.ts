import { BoxGeometry, BufferGeometry, IESSpotLight, MathUtils, Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, Vector3 } from 'three/webgpu'
import { IESLoader } from 'three/addons/loaders/IESLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget, Timeline } from '@io-gui/three'

/** Seconds in which the spots sweep in and out once (π/2 rad/s): the timeline length, so looping is seamless. */
const PERIOD = 4

/** The lights' colors and corners: each sweeps its target between its own corner and the center. */
const LIGHTS: { name: string; color: number; x: number; z: number; ies: string }[] = [
  { name: 'Red', color: 0xff0000, x: 6.5, z: 6.5, ies: '007cfb11e343e2f42e3b476be4ab684e.ies' },
  { name: 'Green', color: 0x00ff00, x: - 6.5, z: 6.5, ies: '06b4cfdc8805709e767b5e2e904be8ad.ies' },
  { name: 'Blue', color: 0x0000ff, x: - 6.5, z: - 6.5, ies: '02a7562c650498ebb301153dbbf59207.ies' },
  { name: 'White', color: 0xffffff, x: 6.5, z: - 6.5, ies: '1a936937a49c63374e6d4fbed9252b29.ies' },
]

/**
 * Four colored spot lights shaped by IES light profiles sweep their targets over a floor with a box. The lights
 * join the scene once their profiles have loaded. The source's `helper` toggle is dropped: the light helpers overlay
 * draws the cones. Plays when opened.
 */
@Register
export class LightsIesSpotlightExample extends Document {

  public lights: IESSpotLight[] = []

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 35, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 16, 4, 1 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    const material = new MeshPhongMaterial( { color: 0x999999/*, dithering: true*/ } )

    const geometry = new PlaneGeometry( 200, 200 )
    const mesh = new Mesh( geometry, material )
    mesh.name = 'Floor'
    mesh.rotation.x = - Math.PI * 0.5
    mesh.receiveShadow = true
    mesh.userData.selectable = false
    this.scene.add( mesh )

    const geometry2 = new BoxGeometry( 2, 2, 2 )
    //const geometry2 = new IcosahedronGeometry( 1, 5 );
    const mesh2 = new Mesh( geometry2, material )
    mesh2.name = 'Box'
    mesh2.position.y = 1
    mesh2.castShadow = true
    this.scene.add( mesh2 )

    void this.loadLights()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  /** Adds the lights with their IES profiles: a light's shader is built with or without one. */
  private async loadLights() {
    try {
      const iesLoader = new IESLoader().setPath( 'https://threejs.org/examples/ies/' )
      //iesLoader.type = UnsignedByteType; // LDR

      const iesTextures = await Promise.all( LIGHTS.map( ( { ies } ) => iesLoader.loadAsync( ies ) ) )

      LIGHTS.forEach( ( { name, color, x, z }, i ) => {
        const spotLight = new IESSpotLight( color, 500 )
        spotLight.name = name
        spotLight.position.set( x, 3, z )
        spotLight.angle = Math.PI / 8
        spotLight.penumbra = 0.7
        spotLight.distance = 20
        spotLight.castShadow = true
        spotLight.iesMap = iesTextures[ i ]
        spotLight.target.name = `${name} Target`
        this.scene.add( spotLight )
        this.scene.add( spotLight.target )
        this.lights.push( spotLight )
      } )

      this.pose( this.timeline.currentTime )
      this.notify({kind: 'structure'})

      // The 200-unit floor would dominate whole-scene framing: frame the square the lights stand on.
      const extent = new Mesh( new BufferGeometry().setFromPoints( [ new Vector3( - 6.5, 0, - 6.5 ), new Vector3( 6.5, 3, 6.5 ) ] ) )
      this._frameTarget = extent
    } catch ( e ) {
      console.error( e )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    for ( let i = 0; i < this.lights.length; i ++ ) {
      const t = ( Math.sin( ( time + i ) * ( Math.PI / 2 ) ) + 1 ) / 2

      const x = MathUtils.lerp( this.lights[ i ].position.x, 0, t )
      const z = MathUtils.lerp( this.lights[ i ].position.z, 0, t )

      this.lights[ i ].target.position.x = x
      this.lights[ i ].target.position.z = z
    }
  }
}

import { BufferGeometry, Color, Euler, Loader, MathUtils, Mesh, Node, PerspectiveCamera, SRGBColorSpace, Vector3 } from 'three/webgpu'
import { colorSpaceToWorking } from 'three/tsl'
import { SPLATLoader } from 'three/addons/loaders/SPLATLoader.js'
import { SPZLoader } from 'three/addons/loaders/SPZLoader.js'
import { GaussianSplat } from 'three/addons/objects/GaussianSplat.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

type SplatLoader = Loader<BufferGeometry> & { loadAsync( url: string ): Promise<BufferGeometry> }

/** The splat files, by dropdown label. Credits are in the source example. */
const SOURCES: Record<string, { url: string; loader: new () => SplatLoader; rotation?: Euler; cameraPosition: Vector3 }> = {
  'Millipede (SPLAT)': {
    // Fabian Plum, https://superspl.at/scene/3d5482d4, CC Attribution
    url: 'https://threejs.org/examples/models/splat/millipede.splat',
    loader: SPLATLoader as new () => SplatLoader,
    rotation: new Euler( - Math.PI * - 1.10, Math.PI * - 0.10, Math.PI * 0.15 ),
    cameraPosition: new Vector3( 0, 0.4, 1 ),
  },
  'Lion (SPZ)': {
    // Renaud, https://superspl.at/scene/56155c3f, CC Attribution
    url: 'https://threejs.org/examples/models/spz/lion.v3.spz',
    loader: SPZLoader as new () => SplatLoader,
    rotation: new Euler( Math.PI, 0, 0 ),
    cameraPosition: new Vector3( 0, 0.2, 1 ),
  },
  'Tomatoes (SPZ v4)': {
    // Grail, https://superspl.at/scene/2826d2c0, CC Attribution
    url: 'https://threejs.org/examples/models/spz/tomatoes.v4.spz',
    loader: SPZLoader as new () => SplatLoader,
    cameraPosition: new Vector3( 0, 0.35, 1 ),
  },
}

/**
 * A Gaussian splat capture (`GaussianSplat`), picked with the `source` dropdown. The splats sort by depth for each
 * drawing camera before it draws them, so every view sorts its own order. The source sets the global working color
 * space to sRGB, which a document cannot (it would change every document): each splat's color is converted to the
 * linear working space instead, so the splats blend in linear. The raycast hit marker is dropped (picking selects the
 * splat object). Static.
 */
@Register
export class GaussianSplatExample extends Document {

  public splats?: GaussianSplat
  private loadCount = 0
  private camera: PerspectiveCamera

  @Property({type: String, value: 'Lion (SPZ)'})
  declare source: string

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    this.camera = new PerspectiveCamera( 50, 400 / 250, 0.01, 100 )
    this.camera.name = 'Camera'
    this.camera.position.set( 0, 0.35, 3.2 )
    this.camera.lookAt( 0, 0, 0 )
    this.activeCamera = this.camera

    this.scene.background = new Color( 0x07080f )
    this.sourceChanged()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  sourceChanged() {
    void this.loadSplatSource( this.source )
  }

  private async loadSplatSource( name: string ) {
    const count = ++ this.loadCount
    try {
      const source = SOURCES[ name ]
      const splatData = await new source.loader().loadAsync( source.url )
      if ( count !== this.loadCount ) return

      this.disposeCurrentSplats()

      this.splats = new GaussianSplat( splatData )
      this.splats.name = name
      // The source sets the global working color space to sRGB, so the stored colors blend and show as they are. A
      // document cannot (it would change every document): convert each splat's color to the working space instead.
      this.splats.material.colorNode = colorSpaceToWorking( this.splats.material.colorNode as Node<'vec4'>, SRGBColorSpace ) as unknown as Node<'vec4'>
      if ( source.rotation !== undefined ) this.splats.rotation.copy( source.rotation )
      this.scene.add( this.splats )
      this.fitCameraToSplats( splatData, source.cameraPosition )

      this.notify({kind: 'structure'})

      // Framing reads vertex positions, which are one splat quad's: frame a detached stand-in whose two vertices are
      // the corners of the splats' bounds.
      this.splats.updateMatrixWorld()
      this.splats.computeBoundingBox()
      const box = this.splats.boundingBox!.clone().applyMatrix4( this.splats.matrixWorld )
      this._frameTarget = new Mesh( new BufferGeometry().setFromPoints( [ box.min, box.max ] ) )
    } catch ( e ) {
      console.error( e )
    }
  }

  /** The source's `fitCameraToSplats`: the active camera at the splats' bounding sphere, from `direction`. */
  private fitCameraToSplats( splatData: BufferGeometry, direction: Vector3 ) {
    const camera = this.camera
    this.splats!.updateWorldMatrix( true, false )
    const sphere = splatData.boundingSphere!.clone().applyMatrix4( this.splats!.matrixWorld )
    const radius = Math.max( sphere.radius, 0.01 )
    const distance = radius / Math.sin( MathUtils.degToRad( camera.fov ) * 0.5 )

    camera.position.copy( direction ).normalize().multiplyScalar( distance * 1.15 ).add( sphere.center )
    camera.lookAt( sphere.center )
    camera.near = Math.max( distance / 1000, 0.001 )
    camera.far = Math.max( distance * 10, 10 )
    camera.updateProjectionMatrix()
  }

  private disposeCurrentSplats() {
    if ( this.splats === undefined ) return

    this.scene.remove( this.splats )
    this.splats.geometry.dispose()
    this.splats.material.dispose()
    this.splats = undefined
  }
}

registerEditorConfig(GaussianSplatExample, [
  ['source', ioOptionSelect({model: new Menu({options: Object.keys( SOURCES )})})],
])

registerEditorGroups(GaussianSplatExample, {
  Main: ['source'],
  Hidden: ['splats', 'loadCount', 'camera'],
})

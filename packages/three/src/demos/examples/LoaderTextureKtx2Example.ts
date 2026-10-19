import { Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, WebGPURenderer } from 'three/webgpu'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

const sections = [
  {
    title: 'Uncompressed',
    // Uncompressed formats (rgba8, rgba16, rgba32) load as THREE.DataTexture objects.
    textures: [
      '2d_rgba8.ktx2',
      '2d_rgba8_linear.ktx2',
      '2d_rgba16_linear.ktx2',
      '2d_rgba32_linear.ktx2',
      '2d_rgb9e5_linear.ktx2',
      '2d_r11g11b10_linear.ktx2',
    ]
  },
  {
    title: 'Compressed',
    // Compressed formats (ASTC, BCn, ...) load as THREE.CompressedTexture objects and need native support on the GPU.
    textures: [
      '2d_astc4x4.ktx2',
      '2d_etc1.ktx2',
      '2d_etc2.ktx2',
      '2d_bc1.ktx2',
      '2d_bc3.ktx2',
      '2d_bc4.ktx2',
      '2d_bc5.ktx2',
      '2d_bc7.ktx2',
    ]
  },
  {
    title: 'Universal',
    // Basis Universal textures transcode at runtime into a compressed format the device supports.
    textures: [
      '2d_etc1s.ktx2',
      '2d_uastc.ktx2',
    ]
  },
]

/** Spacing of the planes in a row, and of the rows. */
const COLUMN = 1.25
const ROW = 1.5

/**
 * The KTX2 test textures, one plane per file named after it, in a row per section: uncompressed, compressed (each needs
 * native GPU support; files the device cannot sample fail to load and are left out, as in the source) and Basis
 * Universal. The source's scissor grid of one scene per file and its labels are dropped; its cameras each look at one
 * file, so the document names no active camera and views frame the rows. The textures load in `onRendererInitialized`,
 * after `detectSupport`. Static.
 */
@Register
export class LoaderTextureKtx2Example extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)
    this.scene.background = new Color( 0xe0e0e0 )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  override onRendererInitialized(renderer: WebGPURenderer) {
    super.onRendererInitialized(renderer)
    void this.load( renderer )
  }

  private async load( renderer: WebGPURenderer ) {
    const loader = new KTX2Loader()
      .setPath( 'https://threejs.org/examples/textures/ktx2/' )
      .detectSupport( renderer )

    const geometry = flipY( new PlaneGeometry( 1, 1 ) )

    const rows = sections.map( ( section, row ) => {
      const group = new Group()
      group.name = section.title
      group.position.y = - row * ROW
      this.scene.add( group )

      return Promise.all( section.textures.map( async ( path, column ) => {
        try {
          const texture = await loader.loadAsync( path )
          const mesh = new Mesh( geometry, new MeshBasicMaterial( { map: texture } ) )
          mesh.name = path
          mesh.position.x = ( column - ( section.textures.length - 1 ) / 2 ) * COLUMN
          group.add( mesh )
          this.notify({kind: 'structure'})
        } catch ( e ) {
          console.error( `Failed to load ${path}`, e )
        }
      } ) ).then( () => group )
    } )

    const groups = await Promise.all( rows )
    loader.dispose()
    this._frameTarget = groups
  }
}

/** Rewrite UVs for `flipY=false` textures. */
function flipY( geometry: PlaneGeometry ) {
  const uv = geometry.attributes.uv

  for ( let i = 0; i < uv.count; i ++ ) {
    uv.setY( i, 1 - uv.getY( i ) )
  }

  return geometry
}

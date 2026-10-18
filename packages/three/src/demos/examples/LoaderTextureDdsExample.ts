import {
  AdditiveBlending,
  BoxGeometry,
  CompressedTexture,
  DataTexture,
  DoubleSide,
  LinearFilter,
  Material,
  Mesh,
  MeshBasicMaterial,
  RGBAFormat,
  SRGBColorSpace,
  Texture,
  TorusGeometry
} from 'three/webgpu'
import { DDSLoader } from 'three/addons/loaders/DDSLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of one turn of the boxes (1 rad/s): the timeline length. */
const PERIOD = 2 * Math.PI

/**
 * Workaround (upstream: #35082): uncompressed DDS files (ARGB, 24-bit RGB) arrive as a `CompressedTexture` in
 * `RGBAFormat`, which WebGPU uploads as blocks of a compressed format and has no block size for. The same pixels as a
 * `DataTexture`, mip chain included.
 */
function uncompressed( texture: CompressedTexture ): Texture {
  // DDSLoader sets RGBAFormat on uncompressed files, outside the typed compressed formats.
  if ( ( texture.format as number ) !== RGBAFormat ) return texture

  const mipmaps = texture.mipmaps as unknown as { data: Uint8Array; width: number; height: number }[]
  const level = mipmaps[ 0 ]
  const data = new DataTexture( level.data, level.width, level.height, RGBAFormat )
  if ( mipmaps.length > 1 ) {
    data.mipmaps = mipmaps as unknown as DataTexture['mipmaps']
    data.generateMipmaps = false
  }
  data.minFilter = texture.minFilter
  data.magFilter = texture.magFilter
  data.needsUpdate = true

  return data
}

/**
 * Ten boxes and a torus textured from DDS files: DXT1, DXT3 and DXT5 with and without mipmaps, uncompressed ARGB, BC6H
 * HDR (signed and unsigned) and a 24-bit normal map. BC formats need a desktop GPU. Workaround (upstream: #35083,
 * #35084): the source's three DDS cube maps (the torus' environment map and two boxes) are dropped. `DDSLoader` returns
 * them as 2D compressed textures with six faces, and WebGPU does not upload compressed cube textures (it sizes them
 * 1 × 1 from the face array). Each map is assigned once loaded; the uncompressed ones become `DataTexture`s (see
 * `uncompressed`).
 * Turns with document time; plays when opened.
 */
@Register
export class LoaderTextureDdsExample extends Document {

  public meshes: Mesh[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const geometry = new BoxGeometry( 2, 2, 2 )

    /*
    This is how compressed textures are supposed to be used:

    DXT1 - RGB - opaque textures
    DXT3 - RGBA - transparent textures with sharp alpha transitions
    DXT5 - RGBA - transparent textures with full alpha range
    */

    const material1 = new MeshBasicMaterial()
    const material2 = new MeshBasicMaterial()
    const material3 = new MeshBasicMaterial( { alphaTest: 0.5, side: DoubleSide } )
    const material4 = new MeshBasicMaterial( { side: DoubleSide, blending: AdditiveBlending, depthTest: false, transparent: true } )
    const material7 = new MeshBasicMaterial()
    const material8 = new MeshBasicMaterial()
    const material9 = new MeshBasicMaterial()
    const material10 = new MeshBasicMaterial()
    const material11 = new MeshBasicMaterial()
    const material12 = new MeshBasicMaterial()
    const material13 = new MeshBasicMaterial( { transparent: true } )

    // Workaround (upstream: #35081): a compressed texture still loading has no mipmaps, which WebGPU reads when it
    // binds the texture: assign each map once it arrives (views draw on document changes only, so report it too).
    const loader = new DDSLoader()
    const load = ( url: string, material: MeshBasicMaterial, options: { srgb?: boolean; linear?: boolean } = {} ) => {
      loader.load( 'https://threejs.org/examples/textures/' + url, ( texture ) => {
        const map = uncompressed( texture )
        if ( options.linear ) map.minFilter = map.magFilter = LinearFilter
        map.anisotropy = 4
        if ( options.srgb ) map.colorSpace = SRGBColorSpace
        material.map = map
        material.needsUpdate = true
        this.notify({kind: 'material'})
      } )
    }

    load( 'compressed/disturb_dxt1_nomip.dds', material1, { srgb: true, linear: true } )
    load( 'compressed/disturb_dxt1_mip.dds', material2, { srgb: true } )
    load( 'compressed/hepatica_dxt3_mip.dds', material3, { srgb: true } )
    load( 'compressed/explosion_dxt5_mip.dds', material4, { srgb: true } )
    load( 'compressed/disturb_argb_nomip.dds', material7, { srgb: true, linear: true } )
    load( 'compressed/disturb_argb_mip.dds', material8, { srgb: true } )
    load( 'compressed/disturb_dx10_bc6h_signed_nomip.dds', material9 )
    load( 'compressed/disturb_dx10_bc6h_signed_mip.dds', material10 )
    load( 'compressed/disturb_dx10_bc6h_unsigned_nomip.dds', material11 )
    load( 'compressed/disturb_dx10_bc6h_unsigned_mip.dds', material12 )
    load( 'wave_normals_24bit_uncompressed.dds', material13 )

    const add = ( name: string, mesh: Mesh<BoxGeometry | TorusGeometry, Material>, x: number, y: number ) => {
      mesh.name = name
      mesh.position.x = x
      mesh.position.y = y
      this.scene.add( mesh )
      this.meshes.push( mesh )
    }

    add( 'DXT1', new Mesh( new TorusGeometry(), material1 ), - 10, - 2 )
    add( 'DXT1 Mip', new Mesh( geometry, material2 ), - 6, - 2 )
    add( 'DXT3 Mip', new Mesh( geometry, material3 ), - 6, 2 )
    add( 'DXT5 Mip', new Mesh( geometry, material4 ), - 10, 2 )
    add( 'ARGB', new Mesh( geometry, material7 ), 2, - 2 )
    add( 'ARGB Mip', new Mesh( geometry, material8 ), 2, 2 )
    add( 'BC6H Signed', new Mesh( geometry, material9 ), 6, - 2 )
    add( 'BC6H Signed Mip', new Mesh( geometry, material10 ), 6, 2 )
    add( 'BC6H Unsigned', new Mesh( geometry, material11 ), 10, - 2 )
    add( 'BC6H Unsigned Mip', new Mesh( geometry, material12 ), 10, 2 )
    add( 'RGB 24 bit', new Mesh( geometry, material13 ), - 10, - 6 )
  }

  override onAnimate(delta: number, time: number) {
    for ( let i = 0; i < this.meshes.length; i ++ ) {
      const mesh = this.meshes[ i ]
      mesh.rotation.x = time
      mesh.rotation.y = time
    }
  }
}

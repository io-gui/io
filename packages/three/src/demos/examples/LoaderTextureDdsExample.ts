import {
  AdditiveBlending,
  BoxGeometry,
  CompressedCubeTexture,
  CompressedTexture,
  CompressedTextureImageData,
  CubeReflectionMapping,
  DoubleSide,
  LinearFilter,
  LoadingManager,
  Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  SRGBColorSpace,
  TorusGeometry
} from 'three/webgpu'
import { DDSLoader } from 'three/addons/loaders/DDSLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/** Seconds of one turn of the boxes (1 rad/s): the timeline length. */
const PERIOD = 2 * Math.PI

/**
 * Workaround (upstream: #35084): `DDSLoader` returns a cube map as a 2D `CompressedTexture` with the six faces as its
 * image. The same faces as a `CompressedCubeTexture`, which renderers sample as a cube.
 */
function cubeTexture( texture: CompressedTexture ): CompressedCubeTexture {
  const faces = texture.image as unknown as CompressedTextureImageData[]
  return new CompressedCubeTexture( faces, texture.format, texture.type )
}

/**
 * Twelve boxes and a torus textured from DDS files: DXT1, DXT3 and DXT5 with and without mipmaps, uncompressed ARGB, BC6H
 * HDR (signed and unsigned), a 24-bit normal map and three cube maps (the torus' environment map and two boxes). BC
 * formats need a desktop GPU. Workaround (upstream: #35084): each cube map is assigned to its material once loaded, as a
 * `CompressedCubeTexture` (see `cubeTexture`).
 * Turns with document time; plays when opened.
 */
@Register
export class LoaderTextureDdsExample extends Document {

  public meshes: Mesh[] = []

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, - 2, 16 )
    this.activeCamera = camera

    const geometry = new BoxGeometry( 2, 2, 2 )

    /*
    This is how compressed textures are supposed to be used:

    DXT1 - RGB - opaque textures
    DXT3 - RGBA - transparent textures with sharp alpha transitions
    DXT5 - RGBA - transparent textures with full alpha range
    */

    // Views draw on document changes only: report the textures once they have loaded.
    const loader = new DDSLoader( new LoadingManager( () => this.notify({kind: 'material'}) ) )
    loader.setPath( 'https://threejs.org/examples/textures/' )

    const map1 = loader.load( 'compressed/disturb_dxt1_nomip.dds' )
    map1.minFilter = map1.magFilter = LinearFilter
    map1.anisotropy = 4
    map1.colorSpace = SRGBColorSpace

    const map2 = loader.load( 'compressed/disturb_dxt1_mip.dds' )
    map2.anisotropy = 4
    map2.colorSpace = SRGBColorSpace

    const map3 = loader.load( 'compressed/hepatica_dxt3_mip.dds' )
    map3.anisotropy = 4
    map3.colorSpace = SRGBColorSpace

    const map4 = loader.load( 'compressed/explosion_dxt5_mip.dds' )
    map4.anisotropy = 4
    map4.colorSpace = SRGBColorSpace

    const map5 = loader.load( 'compressed/disturb_argb_nomip.dds' )
    map5.minFilter = map5.magFilter = LinearFilter
    map5.anisotropy = 4
    map5.colorSpace = SRGBColorSpace

    const map6 = loader.load( 'compressed/disturb_argb_mip.dds' )
    map6.anisotropy = 4
    map6.colorSpace = SRGBColorSpace

    const map7 = loader.load( 'compressed/disturb_dx10_bc6h_signed_nomip.dds' )
    map7.anisotropy = 4

    const map8 = loader.load( 'compressed/disturb_dx10_bc6h_signed_mip.dds' )
    map8.anisotropy = 4

    const map9 = loader.load( 'compressed/disturb_dx10_bc6h_unsigned_nomip.dds' )
    map9.anisotropy = 4

    const map10 = loader.load( 'compressed/disturb_dx10_bc6h_unsigned_mip.dds' )
    map10.anisotropy = 4

    const map11 = loader.load( 'wave_normals_24bit_uncompressed.dds' )
    map11.anisotropy = 4

    // Workaround (upstream: #35084): the source passes the textures `load()` returns as `envMap` at material creation.
    const loadCubemap = ( url: string, material: MeshBasicMaterial ) => {
      loader.load( url, ( texture ) => {
        const cubemap = cubeTexture( texture )
        cubemap.magFilter = LinearFilter
        cubemap.minFilter = LinearFilter
        cubemap.mapping = CubeReflectionMapping
        cubemap.colorSpace = SRGBColorSpace
        cubemap.needsUpdate = true
        material.envMap = cubemap
        material.needsUpdate = true
      } )
    }

    const material1 = new MeshBasicMaterial( { map: map1 } )
    const material2 = new MeshBasicMaterial( { map: map2 } )
    const material3 = new MeshBasicMaterial( { map: map3, alphaTest: 0.5, side: DoubleSide } )
    const material4 = new MeshBasicMaterial( { map: map4, side: DoubleSide, blending: AdditiveBlending, depthTest: false, transparent: true } )
    const material5 = new MeshBasicMaterial()
    const material6 = new MeshBasicMaterial()
    const material7 = new MeshBasicMaterial( { map: map5 } )
    const material8 = new MeshBasicMaterial( { map: map6 } )
    const material9 = new MeshBasicMaterial( { map: map7 } )
    const material10 = new MeshBasicMaterial( { map: map8 } )
    const material11 = new MeshBasicMaterial( { map: map9 } )
    const material12 = new MeshBasicMaterial( { map: map10 } )
    const material13 = new MeshBasicMaterial( { map: map11, transparent: true } )

    loadCubemap( 'compressed/Mountains.dds', material1 )
    loadCubemap( 'compressed/Mountains_argb_mip.dds', material5 )
    loadCubemap( 'compressed/Mountains_argb_nomip.dds', material6 )

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
    add( 'ARGB Cube Mip', new Mesh( geometry, material5 ), - 2, 2 )
    add( 'ARGB Cube', new Mesh( geometry, material6 ), - 2, - 2 )
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

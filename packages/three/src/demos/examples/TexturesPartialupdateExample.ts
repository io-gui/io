import {
  Color,
  DataTexture,
  LinearFilter,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  WebGPURenderer
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorGroups } from '@io-gui/editors'

/** Seconds between patches. */
const INTERVAL = 0.1

/** Most patches per draw: scrubbing forward adds at most this many. */
const MAX_PATCHES = 10

/**
 * A carbon texture on a plane, overwritten in 32 × 32 patches of random color at random places, ten times a second,
 * by copying a data texture into it on the GPU (`renderer.copyTextureToTexture`). The copies run before the views
 * draw (`onBeforeDraw`), one per 0.1 s of time played forward, so the patches build up while playing and stay when
 * scrubbing back or at a loop wrap. Plays when opened.
 */
@Register
export class TexturesPartialupdateExample extends Document {

  public mesh: Mesh<PlaneGeometry, MeshBasicMaterial>
  private dataTexture: DataTexture
  private diffuseMap: Texture
  private loaded = false
  /** Time played forward since the last patch, per renderer. */
  private elapsed = new WeakMap<WebGPURenderer, number>()
  private position = new Vector2()
  private color = new Color()

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    const camera = new PerspectiveCamera( 70, 400 / 250, 0.01, 10 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 2 )
    this.activeCamera = camera

    const loader = new TextureLoader()
    this.diffuseMap = loader.load( 'https://threejs.org/examples/textures/carbon/Carbon.png', () => {
      this.loaded = true
      this.notify({kind: 'material'})
    } )
    this.diffuseMap.colorSpace = SRGBColorSpace
    this.diffuseMap.minFilter = LinearFilter
    this.diffuseMap.generateMipmaps = false

    const geometry = new PlaneGeometry( 2, 2 )
    const material = new MeshBasicMaterial( { map: this.diffuseMap } )

    this.mesh = new Mesh( geometry, material )
    this.mesh.name = 'Plane'
    this.scene.add( this.mesh )

    //

    const width = 32
    const height = 32

    const data = new Uint8Array( width * height * 4 )
    this.dataTexture = new DataTexture( data, width, height )
    this.dataTexture.colorSpace = SRGBColorSpace
  }

  override onBeforeDraw(renderer: WebGPURenderer, delta: number) {
    // The source copies onto the texture before it loads too; the patches would vanish when it uploads.
    if ( ! this.loaded ) return

    let elapsed = ( this.elapsed.get( renderer ) ?? 0 ) + delta
    let patches = 0
    while ( elapsed >= INTERVAL ) {
      elapsed -= INTERVAL
      if ( patches++ >= MAX_PATCHES ) continue

      this.position.x = ( 32 * MathUtils.randInt( 1, 16 ) ) - 32
      this.position.y = ( 32 * MathUtils.randInt( 1, 16 ) ) - 32

      // generate new color data
      this.updateDataTexture( this.dataTexture )

      // perform copy from src to dest texture to a random position

      renderer.copyTextureToTexture( this.dataTexture, this.diffuseMap, null, this.position )
    }
    this.elapsed.set( renderer, elapsed )
  }

  private updateDataTexture(texture: DataTexture) {
    const size = texture.image.width * texture.image.height
    const data = texture.image.data as Uint8Array

    // generate a random color and update texture data

    this.color.setHex( Math.random() * 0xffffff )

    const r = Math.floor( this.color.r * 255 )
    const g = Math.floor( this.color.g * 255 )
    const b = Math.floor( this.color.b * 255 )

    for ( let i = 0; i < size; i ++ ) {

      const stride = i * 4

      data[ stride ] = r
      data[ stride + 1 ] = g
      data[ stride + 2 ] = b
      data[ stride + 3 ] = 1

    }

    texture.needsUpdate = true
  }
}

registerEditorGroups(TexturesPartialupdateExample, {
  Hidden: ['mesh', 'dataTexture', 'diffuseMap', 'loaded', 'elapsed', 'position', 'color'],
})

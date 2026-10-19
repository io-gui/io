import {
  AdditiveBlending,
  Blending,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  MultiplyBlending,
  NoBlending,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  SubtractiveBlending,
  Texture,
  TextureLoader
} from 'three/webgpu'
import { Register } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'

/**
 * Seconds in which the background scroll repeats: the timeline length, so looping is seamless. The source scrolls
 * 0.16 and 0.08 texture repeats per second along x and y.
 */
const PERIOD = 12.5

/**
 * Five images (rows) drawn with each blending mode (columns) over a scrolling checkered background. The background and
 * labels are drawn on `OffscreenCanvas`es instead of DOM canvases. Plays when opened.
 */
@Register
export class MaterialsBlendingExample extends Document {

  public grid: Group
  private mapBg: CanvasTexture<OffscreenCanvas>

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 70, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 600 )
    this.activeCamera = camera

    // BACKGROUND

    const canvas = new OffscreenCanvas( 128, 128 )
    const ctx = canvas.getContext( '2d' )!

    ctx.fillStyle = '#ddd'
    ctx.fillRect( 0, 0, 128, 128 )
    ctx.fillStyle = '#555'
    ctx.fillRect( 0, 0, 64, 64 )
    ctx.fillStyle = '#999'
    ctx.fillRect( 32, 32, 32, 32 )
    ctx.fillStyle = '#555'
    ctx.fillRect( 64, 64, 64, 64 )
    ctx.fillStyle = '#777'
    ctx.fillRect( 96, 96, 32, 32 )

    this.mapBg = new CanvasTexture( canvas )
    this.mapBg.colorSpace = SRGBColorSpace
    this.mapBg.wrapS = this.mapBg.wrapT = RepeatWrapping
    this.mapBg.repeat.set( 64, 32 )

    this.scene.background = this.mapBg

    // OBJECTS

    const blendings: {name: string; constant: Blending}[] = [
      { name: 'No', constant: NoBlending },
      { name: 'Normal', constant: NormalBlending },
      { name: 'Additive', constant: AdditiveBlending },
      { name: 'Subtractive', constant: SubtractiveBlending },
      { name: 'Multiply', constant: MultiplyBlending }
    ]

    // Views draw on document changes only, so report each texture when it arrives.
    const textureLoader = new TextureLoader()
    const load = ( url: string ) => {
      const texture = textureLoader.load( 'https://threejs.org/examples/textures/' + url, () => this.notify({kind: 'material'}) )
      texture.colorSpace = SRGBColorSpace
      return texture
    }

    const map0 = load( 'uv_grid_opengl.jpg' )
    const map1 = load( 'sprite0.jpg' )
    const map2 = load( 'sprite0.png' )
    const map3 = load( 'lensflare/lensflare0.png' )
    const map4 = load( 'lensflare/lensflare0_alpha.png' )

    const geo1 = new PlaneGeometry( 100, 100 )
    const geo2 = new PlaneGeometry( 100, 25 )

    this.grid = new Group()
    this.grid.name = 'Grid'
    this.scene.add( this.grid )

    const addImageRow = ( map: Texture, y: number ) => {
      for ( let i = 0; i < blendings.length; i ++ ) {
        const blending = blendings[ i ]
        const material = new MeshBasicMaterial( { map: map } )
        material.transparent = true
        material.blending = blending.constant
        material.premultipliedAlpha = true

        const x = ( i - blendings.length / 2 ) * 110
        const z = 0

        let mesh = new Mesh( geo1, material )
        mesh.name = blending.name
        mesh.position.set( x, y, z )
        this.grid.add( mesh )

        mesh = new Mesh( geo2, generateLabelMaterial( blending.name ) )
        mesh.name = 'Label'
        mesh.position.set( x, y - 75, z )
        this.grid.add( mesh )
      }
    }

    addImageRow( map0, 300 )
    addImageRow( map1, 150 )
    addImageRow( map2, 0 )
    addImageRow( map3, - 150 )
    addImageRow( map4, - 300 )

    this.pose( this.timeline.currentTime )
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    if ( ! this.mapBg ) return
    // The source's time: Date.now() * 0.00025.
    const t = time * 0.25
    const ox = ( t * - 0.01 * this.mapBg.repeat.x ) % 1
    const oy = ( t * - 0.01 * this.mapBg.repeat.y ) % 1
    this.mapBg.offset.set( ox, oy )
  }
}

function generateLabelMaterial(text: string) {
  const canvas = new OffscreenCanvas( 128, 32 )
  const ctx = canvas.getContext( '2d' )!

  ctx.fillStyle = 'rgba( 0, 0, 0, 0.95 )'
  ctx.fillRect( 0, 0, 128, 32 )

  ctx.fillStyle = 'white'
  ctx.font = 'bold 12pt arial'
  ctx.fillText( text, 10, 22 )

  const map = new CanvasTexture( canvas )
  map.colorSpace = SRGBColorSpace

  const material = new MeshBasicMaterial( { map: map, transparent: true } )

  return material
}

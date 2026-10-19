import {
  AddEquation,
  BlendingDstFactor,
  BlendingEquation,
  BlendingSrcFactor,
  CanvasTexture,
  CustomBlending,
  DstAlphaFactor,
  DstColorFactor,
  Group,
  MaxEquation,
  Mesh,
  MeshBasicMaterial,
  MinEquation,
  OneFactor,
  OneMinusDstAlphaFactor,
  OneMinusDstColorFactor,
  OneMinusSrcAlphaFactor,
  OneMinusSrcColorFactor,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  ReverseSubtractEquation,
  SrcAlphaFactor,
  SrcAlphaSaturateFactor,
  SrcColorFactor,
  SRGBColorSpace,
  SubtractEquation,
  TextureLoader,
  ZeroFactor
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/**
 * Seconds in which the background scroll repeats: the timeline length, so looping is seamless. The source scrolls
 * 0.16 and 0.08 texture repeats per second along x and y.
 */
const PERIOD = 12.5

const equations: Record<string, BlendingEquation> = { Add: AddEquation, Subtract: SubtractEquation, ReverseSubtract: ReverseSubtractEquation, Min: MinEquation, Max: MaxEquation }

const src: { name: string; constant: BlendingSrcFactor }[] = [
  { name: 'Zero', constant: ZeroFactor },
  { name: 'One', constant: OneFactor },
  { name: 'SrcColor', constant: SrcColorFactor },
  { name: 'OneMinusSrcColor', constant: OneMinusSrcColorFactor },
  { name: 'SrcAlpha', constant: SrcAlphaFactor },
  { name: 'OneMinusSrcAlpha', constant: OneMinusSrcAlphaFactor },
  { name: 'DstAlpha', constant: DstAlphaFactor },
  { name: 'OneMinusDstAlpha', constant: OneMinusDstAlphaFactor },
  { name: 'DstColor', constant: DstColorFactor },
  { name: 'OneMinusDstColor', constant: OneMinusDstColorFactor },
  { name: 'SrcAlphaSaturate', constant: SrcAlphaSaturateFactor }
]

const dst: { name: string; constant: BlendingDstFactor }[] = [
  { name: 'Zero', constant: ZeroFactor },
  { name: 'One', constant: OneFactor },
  { name: 'SrcColor', constant: SrcColorFactor },
  { name: 'OneMinusSrcColor', constant: OneMinusSrcColorFactor },
  { name: 'SrcAlpha', constant: SrcAlphaFactor },
  { name: 'OneMinusSrcAlpha', constant: OneMinusSrcAlphaFactor },
  { name: 'DstAlpha', constant: DstAlphaFactor },
  { name: 'OneMinusDstAlpha', constant: OneMinusDstAlphaFactor },
  { name: 'DstColor', constant: DstColorFactor },
  { name: 'OneMinusDstColor', constant: OneMinusDstColorFactor }
]

/**
 * A lens flare drawn with every pair of custom blend factors (source factors in columns, destination factors in rows)
 * over a scrolling checkered background, all with the `blendEquation` picked in the Document tab. WebGPU requires both
 * factors to be `One` for `Min` and `Max`, which WebGL ignores, so those equations draw with `One` factors: the same
 * result. The background and labels are drawn on `OffscreenCanvas`es. Plays when opened.
 */
@Register
export class MaterialsBlendingCustomExample extends Document {

  public grid: Group
  private mapBg: CanvasTexture<OffscreenCanvas>
  private materials: { material: MeshBasicMaterial; src: BlendingSrcFactor; dst: BlendingDstFactor }[] = []

  @Property({type: String, value: 'Add'})
  declare blendEquation: string

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    const camera = new PerspectiveCamera( 80, 400 / 250, 1, 1000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 700 )
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

    // FOREGROUND OBJECTS

    const geo1 = new PlaneGeometry( 100, 100 )
    const geo2 = new PlaneGeometry( 100, 25 )

    // Views draw on document changes only, so report the texture when it arrives.
    const texture = new TextureLoader().load( 'https://threejs.org/examples/textures/lensflare/lensflare0_alpha.png', () => this.notify({kind: 'material'}) )
    texture.colorSpace = SRGBColorSpace

    this.grid = new Group()
    this.grid.name = 'Grid'
    this.scene.add( this.grid )

    for ( let i = 0; i < dst.length; i ++ ) {

      const blendDst = dst[ i ]

      for ( let j = 0; j < src.length; j ++ ) {

        const blendSrc = src[ j ]

        const material = new MeshBasicMaterial( { map: texture } )
        material.transparent = true

        material.blending = CustomBlending
        material.blendSrc = blendSrc.constant
        material.blendDst = blendDst.constant
        material.blendEquation = AddEquation

        const x = ( j - src.length / 2 ) * 110
        const z = 0
        const y = ( i - dst.length / 2 ) * 110 + 50

        const mesh = new Mesh( geo1, material )
        mesh.name = `${blendSrc.name} / ${blendDst.name}`
        mesh.position.set( x, - y, z )
        this.grid.add( mesh )

        this.materials.push( { material, src: blendSrc.constant, dst: blendDst.constant } )

      }

    }

    for ( let j = 0; j < src.length; j ++ ) {

      const blendSrc = src[ j ]

      const x = ( j - src.length / 2 ) * 110
      const z = 0
      const y = ( 0 - dst.length / 2 ) * 110 + 50

      const mesh = new Mesh( geo2, generateLabelMaterial( blendSrc.name, 'rgba( 0, 150, 0, 1 )' ) )
      mesh.name = 'Label'
      mesh.position.set( x, - ( y - 70 ), z )
      this.grid.add( mesh )

    }

    for ( let i = 0; i < dst.length; i ++ ) {

      const blendDst = dst[ i ]

      const x = ( 0 - src.length / 2 ) * 110 - 125
      const z = 0
      const y = ( i - dst.length / 2 ) * 110 + 165

      const mesh = new Mesh( geo2, generateLabelMaterial( blendDst.name, 'rgba( 150, 0, 0, 1 )' ) )
      mesh.name = 'Label'
      mesh.position.set( x, - ( y - 120 ), z )
      this.grid.add( mesh )

    }

    this.pose( this.timeline.currentTime )
  }

  blendEquationChanged() {
    if ( ! this.materials ) return
    const equation = equations[ this.blendEquation ]
    // Workaround (upstream: minmax-blend-factors): WebGPU rejects Min / Max unless both factors are One; WebGL ignores
    // them.
    const minMax = equation === MinEquation || equation === MaxEquation

    for ( const { material, src, dst } of this.materials ) {
      material.blendEquation = equation
      material.blendSrc = minMax ? OneFactor : src
      material.blendDst = minMax ? OneFactor : dst
      material.needsUpdate = true
    }

    this.notify({kind: 'material'})
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

function generateLabelMaterial(text: string, bg: string) {
  const canvas = new OffscreenCanvas( 128, 32 )
  const ctx = canvas.getContext( '2d' )!

  ctx.fillStyle = bg
  ctx.fillRect( 0, 0, 128, 32 )

  ctx.fillStyle = 'white'
  ctx.font = 'bold 11pt arial'
  ctx.fillText( text, 8, 22 )

  const map = new CanvasTexture( canvas )
  map.colorSpace = SRGBColorSpace

  const material = new MeshBasicMaterial( { map: map, transparent: true } )

  return material
}

registerEditorConfig(MaterialsBlendingCustomExample, [
  ['blendEquation', ioOptionSelect({model: new Menu({options: Object.keys( equations )})})],
])

registerEditorGroups(MaterialsBlendingCustomExample, {
  Main: ['blendEquation'],
  Hidden: ['grid', 'mapBg', 'materials'],
})

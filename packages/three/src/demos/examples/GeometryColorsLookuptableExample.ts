import {
  Box3,
  BufferGeometry,
  BufferGeometryLoader,
  CanvasTexture,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  Vector3
} from 'three/webgpu'
import { Lut } from 'three/addons/math/Lut.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

/**
 * A pressure field on a mesh colored through a lookup table (`Lut`), with `colorMap` (rainbow, cool to warm, black body,
 * grayscale) in the Document tab. The source draws the color scale in a second, orthographic scene over the view; here
 * it is a `Legend` sprite beside the model, painted on an `OffscreenCanvas`. The light rides on the source's perspective
 * camera, the active camera. Static.
 */
@Register
export class GeometryColorsLookuptableExample extends Document {

  public mesh: Mesh<BufferGeometry, MeshLambertMaterial>
  public sprite: Sprite
  private lut = new Lut()
  private lutCanvas: OffscreenCanvas
  private map: CanvasTexture<OffscreenCanvas>

  @Property({type: String, value: 'rainbow'})
  declare colorMap: string

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0xffffff )

    this.lutCanvas = new OffscreenCanvas( 1, this.lut.n )
    // `Lut.updateCanvas` reads the pixels back each time: create the context it will get with that hint.
    this.lutCanvas.getContext( '2d', { alpha: false, willReadFrequently: true } )
    this.map = new CanvasTexture( this.lutCanvas )
    this.map.colorSpace = SRGBColorSpace

    this.sprite = new Sprite( new SpriteMaterial( {
      map: this.map
    } ) )
    this.sprite.name = 'Legend'
    this.sprite.visible = false
    this.scene.add( this.sprite )

    this.mesh = new Mesh( new BufferGeometry(), new MeshLambertMaterial( {
      side: DoubleSide,
      color: 0xF5F5F5,
      vertexColors: true
    } ) )
    this.mesh.name = 'Pressure'
    // Its geometry arrives with the model.
    this.mesh.visible = false
    this.scene.add( this.mesh )

    // The source's perspective camera, carrying the light (its orthographic camera draws the color scale).
    const camera = new PerspectiveCamera( 60, 400 / 250, 1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 10 )
    camera.lookAt( 0, 0, 0 )
    this.scene.add( camera )
    this.activeCamera = camera

    const pointLight = new PointLight( 0xffffff, 3, 0, 0 )
    pointLight.name = 'Camera Light'
    camera.add( pointLight )

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  colorMapChanged() {
    this.updateColors()
  }

  private async loadModel() {
    try {
      const geometry = await new BufferGeometryLoader().loadAsync( 'https://threejs.org/examples/models/json/pressure.json' )

      geometry.center()
      geometry.computeVertexNormals()

      // default color attribute
      const colors: number[] = []

      for ( let i = 0, n = geometry.attributes.position.count; i < n; ++ i ) {

        colors.push( 1, 1, 1 )

      }

      geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) )

      this.mesh.geometry.dispose()
      this.mesh.geometry = geometry
      this.mesh.visible = true

      // The legend stands right of the model, as tall as it, eight times taller than wide.
      const box = new Box3().setFromBufferAttribute( geometry.attributes.position as Float32BufferAttribute )
      const size = box.getSize( new Vector3() )
      this.sprite.scale.set( size.y / 8, size.y, 1 )
      this.sprite.position.set( box.max.x + size.y / 4, 0, 0 )
      this.sprite.visible = true

      this.updateColors()

      this.notify({kind: 'structure'})
      this._frameTarget = [ this.mesh, this.sprite ]
    } catch ( e ) {
      console.error( e )
    }
  }

  private updateColors() {
    const geometry = this.mesh?.geometry
    const pressures = geometry?.attributes.pressure
    if ( ! pressures ) return

    const lut = this.lut
    lut.setColorMap( this.colorMap )

    lut.setMax( 2000 )
    lut.setMin( 0 )

    const colors = geometry.attributes.color
    const color = new Color()

    for ( let i = 0; i < pressures.array.length; i ++ ) {

      const colorValue = pressures.array[ i ]

      color.copy( lut.getColor( colorValue ) ).convertSRGBToLinear()

      colors.setXYZ( i, color.r, color.g, color.b )

    }

    colors.needsUpdate = true

    lut.updateCanvas( this.lutCanvas as unknown as HTMLCanvasElement )
    this.map.needsUpdate = true

    this.notify({kind: 'geometry'})
    this.notify({kind: 'material'})
  }
}

registerEditorConfig(GeometryColorsLookuptableExample, [
  ['colorMap', ioOptionSelect({model: new Menu({options: [ 'rainbow', 'cooltowarm', 'blackbody', 'grayscale' ]})})],
])

registerEditorGroups(GeometryColorsLookuptableExample, {
  Main: ['colorMap'],
  Hidden: ['mesh', 'sprite', 'lut', 'lutCanvas', 'map'],
})

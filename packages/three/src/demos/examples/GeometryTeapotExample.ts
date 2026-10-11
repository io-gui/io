import {
  AmbientLight,
  CubeTextureLoader,
  DirectionalLight,
  DoubleSide,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader
} from 'three/webgpu'
import { TeapotGeometry } from 'three/addons/geometries/TeapotGeometry.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

const teapotSize = 300

/**
 * The Utah teapot (`TeapotGeometry`) with its tessellation, parts, lid fit and Blinn scaling, and six shadings
 * (Document tab). The reflective shading shows its Pisa cube map as the background.
 */
@Register
export class GeometryTeapotExample extends Document {

  public teapot: Mesh
  public materials: Record<string, Material>
  private textureCube: ReturnType<CubeTextureLoader['load']>

  @Property({type: Number, value: 15})
  declare tessellation: number

  @Property({type: Boolean, value: true})
  declare lid: boolean

  @Property({type: Boolean, value: true})
  declare body: boolean

  @Property({type: Boolean, value: true})
  declare bottom: boolean

  @Property({type: Boolean, value: false})
  declare fitLid: boolean

  @Property({type: Boolean, value: false})
  declare nonBlinn: boolean

  @Property({type: String, value: 'glossy'})
  declare shading: string

  constructor(args?: DocumentProps) {
    super(args)

    // LIGHTS

    const ambientLight = new AmbientLight( 0x7c7c7c, 2.0 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const light = new DirectionalLight( 0xFFFFFF, 2.0 )
    light.name = 'Key'
    light.position.set( 0.32, 0.39, 0.7 )
    this.scene.add( light )

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    // TEXTURE MAP

    const textureMap = new TextureLoader().load( 'https://threejs.org/examples/textures/uv_grid_opengl.jpg', onLoad )
    textureMap.wrapS = textureMap.wrapT = RepeatWrapping
    textureMap.anisotropy = 16
    textureMap.colorSpace = SRGBColorSpace

    // REFLECTION MAP

    const path = 'https://threejs.org/examples/textures/cube/pisa/'
    const urls = [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ]

    this.textureCube = new CubeTextureLoader().setPath( path ).load( urls, onLoad )

    this.materials = {
      'wireframe': new MeshBasicMaterial( { wireframe: true } ),
      'flat': new MeshPhongMaterial( { specular: 0x000000, flatShading: true, side: DoubleSide } ),
      'smooth': new MeshLambertMaterial( { side: DoubleSide } ),
      'glossy': new MeshPhongMaterial( { color: 0xc0c0c0, specular: 0x404040, shininess: 300, side: DoubleSide } ),
      'textured': new MeshPhongMaterial( { map: textureMap, side: DoubleSide } ),
      'reflective': new MeshPhongMaterial( { envMap: this.textureCube, side: DoubleSide } ),
    }

    this.teapot = new Mesh( this.createGeometry(), this.materials[ this.shading ] )
    this.teapot.name = 'Teapot'
    this.scene.add( this.teapot )

    this.shadingChanged()
  }

  private createGeometry() {
    return new TeapotGeometry( teapotSize,
      this.tessellation,
      this.bottom,
      this.lid,
      this.body,
      this.fitLid,
      ! this.nonBlinn )
  }

  /** Whenever the teapot's shape options change, its geometry is rebuilt. */
  private rebuild() {
    if ( ! this.teapot ) return
    this.teapot.geometry.dispose()
    this.teapot.geometry = this.createGeometry()
    this.notify({kind: 'geometry', ids: [this.teapot.uuid]})
  }

  tessellationChanged() { this.rebuild() }
  lidChanged() { this.rebuild() }
  bodyChanged() { this.rebuild() }
  bottomChanged() { this.rebuild() }
  fitLidChanged() { this.rebuild() }
  nonBlinnChanged() { this.rebuild() }

  shadingChanged() {
    if ( ! this.teapot ) return
    this.teapot.material = this.materials[ this.shading ] ?? this.materials.glossy
    // The cube map is the background only behind the reflective teapot.
    this.scene.background = this.shading === 'reflective' ? this.textureCube : null
    this.notify({kind: 'material', ids: [this.teapot.uuid]})
  }
}

registerEditorConfig(GeometryTeapotExample, [
  ['tessellation', ioOptionSelect({model: new Menu({options: [ 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50 ].map(value => ({value, id: String(value)}))})})],
  ['shading', ioOptionSelect({model: new Menu({options: [ 'wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective' ]})})],
])

registerEditorGroups(GeometryTeapotExample, {
  Main: ['tessellation', 'lid', 'body', 'bottom', 'fitLid', 'nonBlinn', 'shading'],
})

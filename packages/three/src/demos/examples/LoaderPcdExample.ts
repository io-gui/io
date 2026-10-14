import { BufferGeometry, Color, InstancedBufferAttribute, InstancedMesh, PlaneGeometry, Points, PointsMaterial, PointsNodeMaterial, Sphere } from 'three/webgpu'
import { instancedBufferAttribute, materialColor } from 'three/tsl'
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

const FILES = [
  'ascii/simple.pcd',
  'binary/Zaghetto.pcd',
  'binary/Zaghetto_8bit.pcd',
  'binary_compressed/pcl_logo.pcd',
]

/**
 * A point cloud from a PCD file, picked with `file` (Document tab), with the source's point `size` and `color`.
 * WebGPU draws `Points` 1 px wide, so a child `InstancedMesh` named `Sprites` draws a quad per point at the size
 * (`PointsNodeMaterial` with the positions as an instanced attribute, the cloud's bounds for framing and culling).
 * The `Points` stay the content: they are what picking and framing see. No background (source: black clear).
 */
@Register
export class LoaderPcdExample extends Document {

  public points?: Points<BufferGeometry, PointsMaterial>
  private sprites?: InstancedMesh<PlaneGeometry, PointsNodeMaterial>

  @Property({type: String, value: 'binary/Zaghetto.pcd'})
  declare file: string

  /** Point size in world units at a distance of one (size attenuation). */
  @Property({type: Number, value: 0.001})
  declare size: number

  @Property({type: Color, init: null})
  declare color: Color

  private loader = new PCDLoader()
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0

  constructor(args?: DocumentProps) {
    super(args)
    this.fileChanged()
  }

  fileChanged() {
    if ( ! this.loader ) return
    void this.loadPointCloud( this.file )
  }

  sizeChanged() {
    if ( ! this.sprites ) return
    this.sprites.material.size = this.size
    this.notify({kind: 'material'})
  }

  colorChanged() {
    this.colorMutated()
  }

  /** The color editor changes the color in place. */
  colorMutated() {
    if ( ! this.points || ! this.sprites ) return
    this.points.material.color.copy( this.color )
    this.sprites.material.color.copy( this.color )
    this.notify({kind: 'material'})
  }

  private async loadPointCloud(file: string) {
    const load = ++ this.loads

    try {
      const points = await this.loader.loadAsync( 'https://threejs.org/examples/models/pcd/' + file )
      if ( load !== this.loads ) return

      if ( this.points ) {
        this.points.geometry.dispose()
        this.points.material.dispose()
        this.sprites?.material.dispose()
        this.scene.remove( this.points )
      }

      points.geometry.center()
      points.geometry.rotateX( Math.PI )
      points.name = file

      this.points = points
      this.sprites = createSprites( points )
      points.add( this.sprites )
      this.scene.add( points )

      this.sizeChanged()
      this.colorMutated()

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: points}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}

/** A quad per point of `points`, drawn at the points material's size. */
function createSprites(points: Points<BufferGeometry, PointsMaterial>) {
  const geometry = points.geometry
  const position = geometry.getAttribute( 'position' )
  const color = geometry.getAttribute( 'color' )

  const material = new PointsNodeMaterial( {
    positionNode: instancedBufferAttribute( new InstancedBufferAttribute( position.array, 3 ) ),
    sizeAttenuation: true,
  } )

  if ( color ) {
    material.colorNode = materialColor.mul( instancedBufferAttribute( new InstancedBufferAttribute( color.array, 3 ) ) )
  }

  const sprites = new InstancedMesh( new PlaneGeometry( 1, 1 ), material, position.count )
  sprites.name = 'Sprites'
  sprites.userData.selectable = false

  // The instance matrices stay identity: the bounds of one quad. Use the cloud's.
  geometry.computeBoundingBox()
  sprites.boundingBox = geometry.boundingBox!.clone()
  sprites.boundingSphere = sprites.boundingBox.getBoundingSphere( new Sphere() )

  return sprites
}

registerEditorConfig(LoaderPcdExample, [
  ['file', ioOptionSelect({model: new Menu({options: FILES})})],
  ['size', ioNumberSlider({min: 0.001, max: 0.01, step: 0.0001})],
])

registerEditorGroups(LoaderPcdExample, {
  Main: ['file', 'size', 'color'],
  Hidden: ['points', 'sprites', 'loader', 'loads'],
})

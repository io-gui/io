import {
  ClippingGroup,
  Color,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Plane,
  SphereGeometry,
  SRGBColorSpace,
  Vector3
} from 'three/webgpu'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * Fifteen nested spheres clipped by three planes: with `clipIntersection` only the region inside all three planes is
 * cut away, otherwise everything outside any of them. The source's per-material clipping planes become a
 * `ClippingGroup`, whose planes the clipping helpers overlay draws (the source's `PlaneHelper`s and `show helpers`
 * toggle are dropped). `alphaToCoverage`, `clipIntersection` and `planeConstant` are in the Document tab;
 * `alphaToCoverage` smooths the cut edges in views drawn with MSAA (`View.msaa`). Static.
 */
@Register
export class ClippingIntersectionExample extends Document {

  public spheres: Group
  public clippingGroup: ClippingGroup
  private clipPlanes = [
    new Plane( new Vector3( 1, 0, 0 ), 0 ),
    new Plane( new Vector3( 0, - 1, 0 ), 0 ),
    new Plane( new Vector3( 0, 0, - 1 ), 0 )
  ]

  @Property({type: Boolean, value: true})
  declare alphaToCoverage: boolean

  @Property({type: Boolean, value: true})
  declare clipIntersection: boolean

  @Property({type: Number, value: 0})
  declare planeConstant: number

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 40, 400 / 250, 1, 200 )
    camera.name = 'Camera'
    camera.position.set( - 1.5, 2.5, 3 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x000000 )

    const light = new HemisphereLight( 0xffffff, 0x080808, 4.5 )
    light.name = 'Hemisphere'
    light.position.set( - 1.25, 1, 1.25 )
    this.scene.add( light )

    this.clippingGroup = new ClippingGroup()
    this.clippingGroup.name = 'Clipping'
    this.clippingGroup.clippingPlanes = this.clipPlanes
    this.clippingGroup.clipIntersection = this.clipIntersection
    this.scene.add( this.clippingGroup )

    this.spheres = new Group()
    this.spheres.name = 'Spheres'

    for ( let i = 1; i <= 30; i += 2 ) {
      const geometry = new SphereGeometry( i / 30, 48, 24 )

      const material = new MeshPhongMaterial( {
        color: new Color().setHSL( Math.random(), 0.5, 0.5, SRGBColorSpace ),
        side: DoubleSide,
        alphaToCoverage: true,
      } )

      const sphere = new Mesh( geometry, material )
      sphere.name = `Sphere${ ( i + 1 ) / 2 }`
      this.spheres.add( sphere )
    }

    this.clippingGroup.add( this.spheres )
  }

  alphaToCoverageChanged() {
    if ( ! this.spheres ) return
    this.spheres.children.forEach( c => {
      const material = ( c as Mesh<SphereGeometry, MeshPhongMaterial> ).material
      material.alphaToCoverage = Boolean( this.alphaToCoverage )
      material.needsUpdate = true
    } )
    this.notify({kind: 'material'})
  }

  clipIntersectionChanged() {
    if ( ! this.clippingGroup ) return
    this.clippingGroup.clipIntersection = this.clipIntersection
    this.notify({kind: 'other'})
  }

  planeConstantChanged() {
    if ( ! this.clipPlanes ) return
    for ( let j = 0; j < this.clipPlanes.length; j ++ ) {
      this.clipPlanes[ j ].constant = this.planeConstant
    }
    this.notify({kind: 'other'})
  }
}

registerEditorConfig(ClippingIntersectionExample, [
  ['planeConstant', ioNumberSlider({min: - 1, max: 1, step: 0.01})],
])

registerEditorGroups(ClippingIntersectionExample, {
  Main: ['alphaToCoverage', 'clipIntersection', 'planeConstant'],
  Hidden: ['spheres', 'clippingGroup', 'clipPlanes'],
})

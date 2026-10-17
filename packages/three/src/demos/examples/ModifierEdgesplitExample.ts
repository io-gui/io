import {
  BufferGeometry,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader
} from 'three/webgpu'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { EdgeSplitModifier } from 'three/addons/modifiers/EdgeSplitModifier.js'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * The Cerberus gun with its vertices merged, then split again along edges sharper than `cutOffAngle` by
 * `EdgeSplitModifier`, so smooth shading keeps hard edges. `showMap`, `smoothShading`, `edgeSplit`, `cutOffAngle` and
 * `tryKeepNormals` are in the Document tab. Static.
 */
@Register
export class ModifierEdgesplitExample extends Document {

  public mesh?: Mesh<BufferGeometry, MeshStandardMaterial>
  private modifier = new EdgeSplitModifier()
  private baseGeometry?: BufferGeometry
  private map?: Texture

  @Property({type: Boolean, value: false})
  declare showMap: boolean

  @Property({type: Boolean, value: true})
  declare smoothShading: boolean

  @Property({type: Boolean, value: true})
  declare edgeSplit: boolean

  @Property({type: Number, value: 20})
  declare cutOffAngle: number

  @Property({type: Boolean, value: true})
  declare tryKeepNormals: boolean

  constructor(args?: DocumentProps) {
    super(args)

    const light = new HemisphereLight( 0xffffff, 0x444444, 3 )
    light.name = 'Hemisphere'
    this.scene.add( light )

    void this.loadModel()

    new TextureLoader().load( 'https://threejs.org/examples/models/obj/cerberus/Cerberus_A.jpg', ( texture ) => {
      this.map = texture
      this.map.colorSpace = SRGBColorSpace
      this.updateMesh()
    } )
  }

  private async loadModel() {
    try {
      const group = await new OBJLoader().loadAsync( 'https://threejs.org/examples/models/obj/cerberus/Cerberus.obj' )
      const cerberus = group.children[ 0 ] as Mesh
      const modelGeometry = cerberus.geometry

      this.baseGeometry = BufferGeometryUtils.mergeVertices( modelGeometry )

      const mesh = new Mesh( this.getGeometry(), new MeshStandardMaterial() )
      mesh.name = 'Cerberus'
      mesh.material.flatShading = ! this.smoothShading
      mesh.rotateY( - Math.PI / 2 )
      mesh.scale.set( 3.5, 3.5, 3.5 )
      mesh.translateZ( 1.5 )
      this.scene.add( mesh )
      this.mesh = mesh

      this.updateMesh()

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  private getGeometry() {
    const baseGeometry = this.baseGeometry!

    if ( this.edgeSplit ) {
      return this.modifier.modify(
        baseGeometry,
        this.cutOffAngle * Math.PI / 180,
        this.tryKeepNormals
      )
    }

    return baseGeometry
  }

  showMapChanged() { this.updateMesh() }
  smoothShadingChanged() { this.updateMesh() }
  edgeSplitChanged() { this.updateMesh() }
  cutOffAngleChanged() { this.updateMesh() }
  tryKeepNormalsChanged() { this.updateMesh() }

  private updateMesh() {
    const mesh = this.mesh
    if ( mesh === undefined ) return

    const geometry = this.getGeometry()
    if ( mesh.geometry !== this.baseGeometry && mesh.geometry !== geometry ) mesh.geometry.dispose()
    mesh.geometry = geometry

    let needsUpdate = mesh.material.flatShading === this.smoothShading
    mesh.material.flatShading = this.smoothShading === false

    if ( this.map !== undefined ) {
      needsUpdate = needsUpdate || mesh.material.map !== ( this.showMap ? this.map : null )
      mesh.material.map = this.showMap ? this.map : null
    }

    mesh.material.needsUpdate = needsUpdate
    this.notify({kind: 'geometry'})
  }
}

registerEditorConfig(ModifierEdgesplitExample, [
  ['cutOffAngle', ioNumberSlider({min: 0, max: 180, step: 1})],
])

registerEditorGroups(ModifierEdgesplitExample, {
  Main: ['showMap', 'smoothShading', 'edgeSplit', 'cutOffAngle', 'tryKeepNormals'],
  Hidden: ['mesh', 'modifier', 'baseGeometry', 'map'],
})

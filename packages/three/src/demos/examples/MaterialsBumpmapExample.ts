import { BufferGeometry, Color, HemisphereLight, Mesh, MeshPhongMaterial, SpotLight, Texture, TextureLoader } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/** The Lee Perry-Smith head with a bump map under a shadowing spot light; `bumpMap` and `bumpScale` in the Document tab. */
@Register
export class MaterialsBumpmapExample extends Document {

  public mesh?: Mesh
  public material: MeshPhongMaterial
  private mapHeight: Texture

  /** Uses the bump map (the source's `enableBumpMap`). */
  @Property({type: Boolean, value: true})
  declare bumpMap: boolean

  @Property({type: Number, value: 10})
  declare bumpScale: number

  constructor(args?: DocumentProps) {
    super(args)

    this.scene.background = new Color( 0x060708 )

    // LIGHTS

    const hemiLight = new HemisphereLight( 0x8d7c7c, 0x494966, 3 )
    hemiLight.name = 'Hemisphere'
    this.scene.add( hemiLight )

    const spotLight = new SpotLight( 0xffffde, 200 )
    spotLight.name = 'Spot'
    spotLight.position.set( 3.5, 0, 7 )
    this.scene.add( spotLight )

    spotLight.castShadow = true

    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048

    spotLight.shadow.camera.near = 2
    spotLight.shadow.camera.far = 15
    spotLight.shadow.camera.fov = 40

    spotLight.shadow.bias = - 0.005

    //

    // Views draw on document changes only, so report the texture when it arrives.
    this.mapHeight = new TextureLoader().load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Disp_NoSmoothUV-4096.jpg', () => this.notify({kind: 'material'}) )

    this.material = new MeshPhongMaterial( {
      color: 0x9c6e49,
      specular: 0x666666,
      shininess: 25,
      bumpMap: this.mapHeight,
      bumpScale: 10
    } )

    this.bumpMapChanged()
    this.bumpScaleChanged()

    void this.loadModel()
  }

  bumpMapChanged() {
    if ( ! this.material ) return
    this.material.bumpMap = this.bumpMap ? this.mapHeight : null
    this.material.needsUpdate = true
  }

  bumpScaleChanged() {
    if ( ! this.material ) return
    this.material.bumpScale = this.bumpScale
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb' )
      const geometry = ( gltf.scene.children[ 0 ] as Mesh<BufferGeometry> ).geometry

      this.mesh = new Mesh( geometry, this.material )
      this.mesh.name = 'Head'
      this.mesh.position.y = - 0.5
      this.mesh.castShadow = true
      this.mesh.receiveShadow = true
      this.scene.add( this.mesh )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: this.mesh}, true)
    } catch ( e ) {
      console.error( e )
    }
  }
}

registerEditorConfig(MaterialsBumpmapExample, [
  ['bumpScale', ioNumberSlider({min: 0, max: 40, step: 0.1})],
])

registerEditorGroups(MaterialsBumpmapExample, {
  Main: ['bumpMap', 'bumpScale'],
  Hidden: ['mesh', 'material', 'mapHeight'],
})

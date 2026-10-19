import { AmbientLight, BufferGeometry, Color, DirectionalLight, Mesh, MeshPhongMaterial, PerspectiveCamera, PointLight, SRGBColorSpace, Texture, TextureLoader, Vector2 } from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioNumberSlider } from '@io-gui/sliders'

/**
 * The Lee Perry-Smith head with color, specular and tangent-space normal maps; `normalMap` and `normalScale` in the
 * Document tab. The source's bleach bypass, color correction and FXAA post passes are dropped (`document-pipeline`).
 */
@Register
export class MaterialsNormalmapExample extends Document {

  public mesh?: Mesh
  public material: MeshPhongMaterial
  private normalTexture: Texture

  /** Uses the normal map (the source's `enableNormalMap`). */
  @Property({type: Boolean, value: true})
  declare normalMap: boolean

  @Property({type: Number, value: 1})
  declare normalScale: number

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 27, 400 / 250, 0.1, 100 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 12 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    this.scene.background = new Color( 0x494949 )

    // LIGHTS

    const ambientLight = new AmbientLight( 0xffffff )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const pointLight = new PointLight( 0xffffff, 30 )
    pointLight.name = 'Point'
    pointLight.position.set( 0, 0, 6 )
    this.scene.add( pointLight )

    const directionalLight = new DirectionalLight( 0xffffff, 3 )
    directionalLight.name = 'Key'
    directionalLight.position.set( 1, - 0.5, - 1 )
    this.scene.add( directionalLight )

    // Views draw on document changes only, so report each texture when it arrives.
    const onLoad = () => this.notify({kind: 'material'})

    const textureLoader = new TextureLoader()

    const diffuseMap = textureLoader.load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Map-COL.jpg', onLoad )
    diffuseMap.colorSpace = SRGBColorSpace

    const specularMap = textureLoader.load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Map-SPEC.jpg', onLoad )
    specularMap.colorSpace = SRGBColorSpace

    this.normalTexture = textureLoader.load( 'https://threejs.org/examples/models/gltf/LeePerrySmith/Infinite-Level_02_Tangent_SmoothUV.jpg', onLoad )

    this.material = new MeshPhongMaterial( {
      color: 0xefefef,
      specular: 0x222222,
      shininess: 35,
      map: diffuseMap,
      specularMap: specularMap,
      normalMap: this.normalTexture,
      normalScale: new Vector2( this.normalScale, this.normalScale )
    } )

    this.normalMapChanged()

    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  normalMapChanged() {
    if ( ! this.material ) return
    this.material.normalMap = this.normalMap ? this.normalTexture : null
    this.material.needsUpdate = true
  }

  normalScaleChanged() {
    if ( ! this.material ) return
    this.material.normalScale.setScalar( this.normalScale )
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb' )
      const geometry = ( gltf.scene.children[ 0 ] as Mesh<BufferGeometry> ).geometry

      this.mesh = new Mesh( geometry, this.material )
      this.mesh.name = 'Head'
      this.mesh.position.y = - 0.5
      this.scene.add( this.mesh )

      this.notify({kind: 'structure'})
      this._frameTarget = this.mesh
    } catch ( e ) {
      console.error( e )
    }
  }
}

registerEditorConfig(MaterialsNormalmapExample, [
  ['normalScale', ioNumberSlider({min: 0, max: 2, step: 0.01})],
])

registerEditorGroups(MaterialsNormalmapExample, {
  Main: ['normalMap', 'normalScale'],
  Hidden: ['mesh', 'material', 'normalTexture'],
})

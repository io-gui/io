import { CubeTexture, CubeTextureLoader, LinearFilter, LinearMipMapLinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, SphereGeometry, SRGBColorSpace } from 'three/webgpu'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

// load customized cube texture
async function loadCubeTextureWithMipmaps() {
  const path = 'https://threejs.org/examples/textures/cube/angus/'
  const format = '.jpg'
  const mipmaps: CubeTexture[] = []
  const maxLevel = 8

  // load mipmaps
  const pendings = []

  for ( let level = 0; level <= maxLevel; ++ level ) {
    const urls = []

    for ( let face = 0; face < 6; ++ face ) {
      urls.push( path + 'cube_m0' + level + '_c0' + face + format )
    }

    const mipmapLevel = level

    pendings.push( new CubeTextureLoader().loadAsync( urls ).then( function ( cubeTexture ) {
      mipmaps[ mipmapLevel ] = cubeTexture
    } ) )
  }

  await Promise.all( pendings )

  const customizedCubeTexture = mipmaps.shift()!
  customizedCubeTexture.mipmaps = mipmaps
  customizedCubeTexture.colorSpace = SRGBColorSpace
  customizedCubeTexture.minFilter = LinearMipMapLinearFilter
  customizedCubeTexture.magFilter = LinearFilter
  customizedCubeTexture.generateMipmaps = false
  customizedCubeTexture.needsUpdate = true

  return customizedCubeTexture
}

/**
 * Two mirror spheres reflecting a cube map whose mip levels are tinted: the right one uses the cube map's own
 * (manual) mipmaps, the left one mipmaps generated from its first level. They appear once the nine levels have
 * loaded. Static.
 */
@Register
export class MaterialsCubemapMipmapsExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super(args)

    const camera = new PerspectiveCamera( 50, 400 / 250, 1, 10000 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 500 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera
    void this.loadModel()
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }

  private async loadModel() {
    try {
      const cubeTexture = await loadCubeTextureWithMipmaps()

      // model

      const sphere = new SphereGeometry( 100, 128, 128 )

      // manual mipmaps
      let material = new MeshBasicMaterial( { color: 0xffffff, envMap: cubeTexture } )
      material.name = 'manual mipmaps'

      const mesh = new Mesh( sphere, material )
      mesh.name = 'ManualMipmaps'
      mesh.position.set( 100, 0, 0 )
      this.scene.add( mesh )

      // auto mipmaps
      material = material.clone()
      material.name = 'auto mipmaps'

      const autoCubeTexture = cubeTexture.clone()
      autoCubeTexture.mipmaps = []
      autoCubeTexture.generateMipmaps = true
      autoCubeTexture.needsUpdate = true

      material.envMap = autoCubeTexture

      const autoMesh = new Mesh( sphere, material )
      autoMesh.name = 'AutoMipmaps'
      autoMesh.position.set( - 100, 0, 0 )
      this.scene.add( autoMesh )

      this.notify({kind: 'structure'})
      this._frameTarget = [ mesh, autoMesh ]
    } catch ( e ) {
      console.error( e )
    }
  }
}

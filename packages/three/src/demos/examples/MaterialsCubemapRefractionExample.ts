import { AmbientLight, BufferGeometry, CubeRefractionMapping, CubeTextureLoader, Group, Mesh, MeshPhongMaterial } from 'three/webgpu'
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/**
 * Three Lucy statues refracting a cube map that is also the background, with different colors and refraction ratios.
 * The source's mouse-driven camera is dropped.
 */
@Register
export class MaterialsCubemapRefractionExample extends Document {

  public statues: Group
  private materials: MeshPhongMaterial[]

  constructor(args?: DocumentProps) {
    super(args)

    const r = 'https://threejs.org/examples/textures/cube/Park3Med/'

    const urls = [
      r + 'px.jpg', r + 'nx.jpg',
      r + 'py.jpg', r + 'ny.jpg',
      r + 'pz.jpg', r + 'nz.jpg'
    ]

    // Views draw on document changes only, so report the texture when it arrives.
    const textureCube = new CubeTextureLoader().load( urls, () => this.notify({kind: 'material'}) )
    textureCube.mapping = CubeRefractionMapping

    this.scene.background = textureCube

    // LIGHTS

    const ambient = new AmbientLight( 0xffffff, 3.5 )
    ambient.name = 'Ambient'
    this.scene.add( ambient )

    // material samples

    const cubeMaterial3 = new MeshPhongMaterial( { color: 0xccddff, envMap: textureCube, refractionRatio: 0.98, reflectivity: 0.9 } )
    const cubeMaterial2 = new MeshPhongMaterial( { color: 0xccfffd, envMap: textureCube, refractionRatio: 0.985 } )
    const cubeMaterial1 = new MeshPhongMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.98 } )
    this.materials = [ cubeMaterial1, cubeMaterial2, cubeMaterial3 ]

    this.statues = new Group()
    this.statues.name = 'Statues'
    this.scene.add( this.statues )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const geometry = await new PLYLoader().loadAsync( 'https://threejs.org/examples/models/ply/binary/Lucy100k.ply' )
      this.createScene( geometry )

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: this.statues}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  private createScene(geometry: BufferGeometry) {
    geometry.computeVertexNormals()

    const s = 1.5
    const xs = [ 0, - 1500, 1500 ]

    for ( let i = 0; i < 3; i ++ ) {
      const mesh = new Mesh( geometry, this.materials[ i ] )
      mesh.name = 'Lucy'
      mesh.position.x = xs[ i ]
      mesh.scale.x = mesh.scale.y = mesh.scale.z = s
      this.statues.add( mesh )
    }
  }
}

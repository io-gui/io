import { ACESFilmicToneMapping, EquirectangularReflectionMapping, Group, Mesh, MeshPhysicalNodeMaterial, PerspectiveCamera, SphereGeometry } from 'three/webgpu'
import { normalWorldGeometry, uniform, pmremTexture } from 'three/tsl'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register, Field } from '@io-gui/core'
import { Document, DocumentProps, FrameTarget } from '@io-gui/three'

/** A 6×5 grid of physical spheres (roughness across, metalness up) reflecting the Royal Esplanade equirectangular map, shown blurred behind them through `pmremTexture`. */
@Register
export class PmremEquirectangularExample extends Document {

  @Field(null)
  declare private _frameTarget: FrameTarget | null

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

    const camera = new PerspectiveCamera( 45, 400 / 250, 0.25, 20 )
    camera.name = 'Camera'
    camera.position.set( 0, 0, 8 )
    camera.lookAt( 0, 0, 0 )
    this.activeCamera = camera

    new UltraHDRLoader()
      .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
      .load( 'royal_esplanade_2k.hdr.jpg', ( map ) => {
        map.mapping = EquirectangularReflectionMapping

        this.scene.backgroundNode = pmremTexture( map, normalWorldGeometry, uniform( 0.5 ) )

        const geometry = new SphereGeometry( 0.4, 64, 64 )
        const spheres = new Group()
        spheres.name = 'Spheres'

        for ( let i = 0; i < 6; i ++ ) {
          for ( let j = 0; j < 5; j ++ ) {
            const material = new MeshPhysicalNodeMaterial( {
              roughness: i / 5,
              metalness: j / 4,
              envMap: map
            } )

            const mesh = new Mesh( geometry, material )
            mesh.name = `Sphere ${i}-${j}`
            mesh.position.x = i - 2.5
            mesh.position.y = j - 2
            spheres.add( mesh )
          }
        }

        this.scene.add( spheres )
        this.notify({kind: 'structure'})
        this._frameTarget = spheres
      } )
  }

  override getEditorFrameTarget() {
    return this._frameTarget
  }
}

import { ACESFilmicToneMapping, EquirectangularReflectionMapping, Group, Mesh, MeshPhysicalNodeMaterial, SphereGeometry } from 'three/webgpu'
import { normalWorldGeometry, uniform, pmremTexture } from 'three/tsl'
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js'
import { Register } from '@io-gui/core'
import { Document, DocumentProps } from '@io-gui/three'

/** A 6×5 grid of physical spheres (roughness across, metalness up) reflecting the Royal Esplanade equirectangular map, shown blurred behind them through `pmremTexture`. */
@Register
export class PmremEquirectangularExample extends Document {

  constructor(args?: DocumentProps) {
    super({toneMapping: ACESFilmicToneMapping, ...args})

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
        this.dispatch('frame-object', {object: spheres}, true)
      } )
  }
}

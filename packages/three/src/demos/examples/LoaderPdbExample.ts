import {
  BoxGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  Vector3
} from 'three/webgpu'
import { PDBLoader } from 'three/addons/loaders/PDBLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'

const MOLECULES: Record<string, string> = {
  'Ethanol': 'ethanol.pdb',
  'Aspirin': 'aspirin.pdb',
  'Caffeine': 'caffeine.pdb',
  'Nicotine': 'nicotine.pdb',
  'LSD': 'lsd.pdb',
  'Cocaine': 'cocaine.pdb',
  'Cholesterol': 'cholesterol.pdb',
  'Lycopene': 'lycopene.pdb',
  'Glucose': 'glucose.pdb',
  'Aluminium oxide': 'Al2O3.pdb',
  'Cubane': 'cubane.pdb',
  'Copper': 'cu.pdb',
  'Fluorite': 'caf2.pdb',
  'Salt': 'nacl.pdb',
  'YBCO superconductor': 'ybco.pdb',
  'Buckyball': 'buckyball.pdb',
  'Graphite': 'graphite.pdb'
}

/**
 * Seconds in which the tumble repeats: the timeline length, so looping is seamless. The source turns 0.4 rad/s about x
 * and 0.28 rad/s about y: ten and seven turns in 50π s.
 */
const PERIOD = 50 * Math.PI

const offset = new Vector3()

/**
 * Molecules from PDB files: atoms as spheres in their element colors, bonds as boxes, tumbling with document time. Pick
 * one with `molecule` (Document tab). The source's `CSS2DRenderer` labels are dropped; atoms are named by their element
 * in the scene graph instead. Plays when opened.
 */
@Register
export class LoaderPdbExample extends Document {

  public root: Group

  @Property({type: String, value: 'Caffeine'})
  declare molecule: string

  private loader = new PDBLoader()
  /** Counts loads, so a slow file does not replace a newer pick. */
  private loads = 0
  private boxGeometry = new BoxGeometry( 1, 1, 1 )
  private sphereGeometry = new IcosahedronGeometry( 1, 3 )

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true, duration: PERIOD}), ...args})

    this.scene.background = new Color( 0x050505 )

    const light1 = new DirectionalLight( 0xffffff, 2.5 )
    light1.name = 'Key'
    light1.position.set( 1, 1, 1 )
    this.scene.add( light1 )

    const light2 = new DirectionalLight( 0xffffff, 1.5 )
    light2.name = 'Fill'
    light2.position.set( - 1, - 1, 1 )
    this.scene.add( light2 )

    this.root = new Group()
    this.root.name = 'Molecule'
    this.scene.add( this.root )

    this.pose( this.timeline.currentTime )
    this.moleculeChanged()
  }

  moleculeChanged() {
    if ( ! this.loader ) return
    void this.loadMolecule( MOLECULES[ this.molecule ] )
  }

  private async loadMolecule(model: string) {
    const load = ++ this.loads
    const url = 'https://threejs.org/examples/models/pdb/' + model

    try {
      const pdb = await this.loader.loadAsync( url )
      if ( load !== this.loads ) return

      this.clear()

      const geometryAtoms = pdb.geometryAtoms
      const geometryBonds = pdb.geometryBonds
      const json = pdb.json

      geometryAtoms.computeBoundingBox()
      geometryAtoms.boundingBox!.getCenter( offset ).negate()

      geometryAtoms.translate( offset.x, offset.y, offset.z )
      geometryBonds.translate( offset.x, offset.y, offset.z )

      let positions = geometryAtoms.getAttribute( 'position' )
      const colors = geometryAtoms.getAttribute( 'color' )

      const position = new Vector3()
      const color = new Color()

      const atoms = new Group()
      atoms.name = 'Atoms'
      this.root.add( atoms )

      for ( let i = 0; i < positions.count; i ++ ) {

        position.x = positions.getX( i )
        position.y = positions.getY( i )
        position.z = positions.getZ( i )

        color.r = colors.getX( i )
        color.g = colors.getY( i )
        color.b = colors.getZ( i )

        const material = new MeshPhongMaterial( { color: color } )

        const object = new Mesh( this.sphereGeometry, material )
        object.name = json.atoms[ i ][ 4 ]
        object.position.copy( position )
        object.position.multiplyScalar( 75 )
        object.scale.multiplyScalar( 25 )
        atoms.add( object )

      }

      positions = geometryBonds.getAttribute( 'position' )

      const start = new Vector3()
      const end = new Vector3()

      const bonds = new Group()
      bonds.name = 'Bonds'
      this.root.add( bonds )

      for ( let i = 0; i < positions.count; i += 2 ) {

        start.x = positions.getX( i )
        start.y = positions.getY( i )
        start.z = positions.getZ( i )

        end.x = positions.getX( i + 1 )
        end.y = positions.getY( i + 1 )
        end.z = positions.getZ( i + 1 )

        start.multiplyScalar( 75 )
        end.multiplyScalar( 75 )

        const object = new Mesh( this.boxGeometry, new MeshPhongMaterial( { color: 0xffffff } ) )
        object.name = 'Bond'
        object.position.copy( start )
        object.position.lerp( end, 0.5 )
        object.scale.set( 5, 5, start.distanceTo( end ) )
        object.lookAt( end )
        bonds.add( object )

      }

      this.notify({kind: 'structure'})
      this.root.updateMatrixWorld( true )
      this.dispatch('frame-object', {object: this.root}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  private clear() {
    for ( const group of [ ...this.root.children ] ) {
      group.traverse( ( object: Object3D ) => {
        const mesh = object as Mesh<BoxGeometry, MeshPhongMaterial>
        if ( mesh.isMesh ) mesh.material.dispose()
      } )
      this.root.remove( group )
    }
  }

  override onAnimate(delta: number, time: number) {
    this.pose( time )
  }

  private pose(time: number) {
    this.root.rotation.x = time * 0.4
    this.root.rotation.y = time * 0.28
  }
}

registerEditorConfig(LoaderPdbExample, [
  ['molecule', ioOptionSelect({model: new Menu({options: Object.keys( MOLECULES )})})],
])

registerEditorGroups(LoaderPdbExample, {
  Main: ['molecule'],
  Hidden: ['root', 'loader', 'loads', 'boxGeometry', 'sphereGeometry'],
})

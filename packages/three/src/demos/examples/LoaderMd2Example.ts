import {
  AmbientLight,
  AnimationClip,
  Color,
  Fog,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  RepeatWrapping,
  SpotLight,
  SRGBColorSpace,
  TextureLoader
} from 'three/webgpu'
import { MD2Character } from 'three/addons/misc/MD2Character.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

const SKINS = [ 'ratamahatta.png', 'ctf_b.png', 'ctf_r.png', 'dead.png', 'gearwhore.png' ]

const WEAPONS: [ string, string ][] = [
  [ 'weapon.md2', 'weapon.png' ],
  [ 'w_bfg.md2', 'w_bfg.png' ],
  [ 'w_blaster.md2', 'w_blaster.png' ],
  [ 'w_chaingun.md2', 'w_chaingun.png' ],
  [ 'w_glauncher.md2', 'w_glauncher.png' ],
  [ 'w_hyperblaster.md2', 'w_hyperblaster.png' ],
  [ 'w_machinegun.md2', 'w_machinegun.png' ],
  [ 'w_railgun.md2', 'w_railgun.png' ],
  [ 'w_rlauncher.md2', 'w_rlauncher.png' ],
  [ 'w_shotgun.md2', 'w_shotgun.png' ],
  [ 'w_sshotgun.md2', 'w_sshotgun.png' ]
]

function labelize( text: string ) {

  const parts = text.split( '.' )

  if ( parts.length > 1 ) {

    parts.length -= 1
    return parts.join( '.' )

  }

  return text

}

/**
 * Ratamahatta, a Quake II character from MD2 files (`MD2Character`): body and weapon play the same morph animation.
 * `skin` and `weapon` are dropdowns, `animations` has a button per clip (the timeline takes its length), and `speed`
 * (the source's playback rate) and `wireframe` are in the Document tab. Views frame the character. Plays when opened.
 */
@Register
export class LoaderMd2Example extends Document {

  public character: MD2Character

  @Property({type: Number, value: 1.0})
  declare speed: number

  @Property({type: Boolean, value: false})
  declare wireframe: boolean

  @Property({type: String, value: labelize( SKINS[ 0 ] )})
  declare skin: string

  @Property({type: String, value: 'none'})
  declare weapon: string

  /** A button per animation clip of the body. */
  @Property({type: Object, init: null})
  declare animations: Record<string, () => void>

  private loaded = false

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    this.scene.background = new Color( 0x050505 )
    this.scene.fog = new Fog( 0x050505, 2.5, 10 )

    // LIGHTS

    const ambientLight = new AmbientLight( 0x666666 )
    ambientLight.name = 'Ambient'
    this.scene.add( ambientLight )

    const light1 = new SpotLight( 0xffffff, 150 )
    light1.name = 'Key'
    light1.position.set( 2, 5, 10 )
    light1.angle = 0.5
    light1.penumbra = 0.5

    light1.castShadow = true
    light1.shadow.mapSize.width = 1024
    light1.shadow.mapSize.height = 1024

    this.scene.add( light1 )

    const light2 = new SpotLight( 0xffffff, 150 )
    light2.name = 'Fill'
    light2.position.set( - 1, 3.5, 3.5 )
    light2.angle = 0.5
    light2.penumbra = 0.5

    light2.castShadow = true
    light2.shadow.mapSize.width = 1024
    light2.shadow.mapSize.height = 1024

    this.scene.add( light2 )

    //  GROUND

    // Views draw on document changes only, so report the texture when it arrives.
    const gt = new TextureLoader().load( 'https://threejs.org/examples/textures/terrain/grasslight-big.jpg', () => this.notify({kind: 'material'}) )
    const gg = new PlaneGeometry( 20, 20 )
    const gm = new MeshPhongMaterial( { color: 0xffffff, map: gt } )

    const ground = new Mesh( gg, gm )
    ground.name = 'Ground'
    ground.rotation.x = - Math.PI / 2
    gt.repeat.set( 8, 8 )
    gt.wrapS = gt.wrapT = RepeatWrapping
    gt.colorSpace = SRGBColorSpace
    ground.receiveShadow = true
    ground.userData.selectable = false

    this.scene.add( ground )

    // CHARACTER

    const config = {

      baseUrl: 'https://threejs.org/examples/models/md2/ratamahatta/',

      body: 'ratamahatta.md2',
      skins: SKINS,
      weapons: WEAPONS

    }

    this.character = new MD2Character()
    this.character.scale = 0.03
    this.character.root.name = 'Ratamahatta'

    this.character.onLoadComplete = () => {
      const character = this.character
      const body = character.meshBody!
      body.name = 'Body'

      // MD2Loader keeps the clips on the geometry.
      const clips = ( body.geometry as unknown as { animations: AnimationClip[] } ).animations
      this.animations = Object.fromEntries( clips.map( clip => [ clip.name, () => this.setAnimation( clip.name ) ] ) )

      this.loaded = true
      this.setAnimation( clips[ 0 ].name )
      this.skinChanged()
      this.weaponChanged()
      this.speedChanged()
      this.wireframeChanged()

      this.notify({kind: 'structure'})
      character.root.updateMatrixWorld( true )
      this.dispatch('frame-object', {object: body}, true)
    }

    this.character.loadParts( config )

    this.scene.add( this.character.root )
  }

  speedChanged() {
    if ( ! this.loaded ) return
    this.character.setPlaybackRate( this.speed )
  }

  wireframeChanged() {
    if ( ! this.loaded ) return
    this.character.setWireframe( this.wireframe )
    this.notify({kind: 'material'})
  }

  skinChanged() {
    if ( ! this.loaded ) return
    const index = SKINS.findIndex( skin => labelize( skin ) === this.skin )
    this.character.setSkin( Math.max( index, 0 ) )
    this.notify({kind: 'material'})
  }

  weaponChanged() {
    if ( ! this.loaded ) return
    const index = WEAPONS.findIndex( weapon => labelize( weapon[ 0 ] ) === this.weapon )
    if ( index < 0 ) {
      for ( const weapon of this.character.weapons ) weapon.visible = false
    } else {
      this.character.setWeapon( index )
      this.character.setWireframe( this.wireframe )
    }
    this.notify({kind: 'other'})
  }

  private setAnimation(name: string) {
    const character = this.character
    character.setAnimation( name )
    const clip = character.mixer!.existingAction( name, character.meshBody! )?.getClip()
    if ( clip ) this.timeline.duration = clip.duration
    character.mixer!.setTime( this.timeline.currentTime )
    this.notify({kind: 'transform'})
  }

  override onAnimate(delta: number) {
    this.character.update( delta )
  }
}

registerEditorConfig(LoaderMd2Example, [
  ['speed', ioNumberSlider({min: 0, max: 2, step: 0.01})],
  ['skin', ioOptionSelect({model: new Menu({options: SKINS.map( labelize )})})],
  ['weapon', ioOptionSelect({model: new Menu({options: [ 'none', ...WEAPONS.map( weapon => labelize( weapon[ 0 ] ) ) ]})})],
  ['animations', ioObject({expanded: true})],
])

registerEditorGroups(LoaderMd2Example, {
  Main: ['skin', 'weapon', 'animations', 'speed', 'wireframe'],
  Hidden: ['character', 'loaded'],
})

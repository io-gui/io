import {
  AnimationAction,
  AnimationMixer,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  LoopOnce,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry
} from 'three/webgpu'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Register, Property } from '@io-gui/core'
import { Document, DocumentProps, Timeline } from '@io-gui/three'
import { ioObject, registerEditorConfig, registerEditorGroups } from '@io-gui/editors'
import { ioOptionSelect, Menu } from '@io-gui/menus'
import { ioNumberSlider } from '@io-gui/sliders'

const STATES = [ 'Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing' ]
const EMOTES = [ 'Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp' ]

/**
 * The expressive robot: a looping `state` (Death, Sitting and Standing play once and hold), `emotes` that play once and
 * fade back to the state, and the face's `expressions` (morph targets), all in the Document tab. A live demo (ADR-0009):
 * the timeline is only its clock, so it pauses and steps forward with the timeline, and ignores time going back. The
 * ground is unselectable and views frame the robot; the grid comes from the grid overlay. Plays when opened.
 */
@Register
export class AnimationSkinningMorphExample extends Document {

  public model?: Group
  public mixer: AnimationMixer = new AnimationMixer( new Group() )
  public actions: Record<string, AnimationAction> = {}
  private activeAction?: AnimationAction

  @Property({type: String, value: 'Walking'})
  declare state: string

  /** A button per emote: plays it once, then fades back to `state`. */
  @Property({type: Object, init: null})
  declare emotes: Record<string, () => void>

  /** The face's morph target influences, by expression. Empty until the model loads. */
  @Property({type: Object, init: null})
  declare expressions: Record<string, number>

  constructor(args?: DocumentProps) {
    super({timeline: new Timeline({autoplay: true}), ...args})

    this.scene.background = new Color( 0xe0e0e0 )
    this.scene.fog = new Fog( 0xe0e0e0, 20, 100 )

    // lights

    const hemiLight = new HemisphereLight( 0xffffff, 0x8d8d8d, 3 )
    hemiLight.name = 'Hemisphere'
    hemiLight.position.set( 0, 20, 0 )
    this.scene.add( hemiLight )

    const dirLight = new DirectionalLight( 0xffffff, 3 )
    dirLight.name = 'Key'
    dirLight.position.set( 0, 20, 10 )
    this.scene.add( dirLight )

    // ground

    const mesh = new Mesh( new PlaneGeometry( 2000, 2000 ), new MeshPhongMaterial( { color: 0xcbcbcb, depthWrite: false } ) )
    mesh.name = 'Ground'
    mesh.rotation.x = - Math.PI / 2
    mesh.userData.selectable = false
    this.scene.add( mesh )

    this.emotes = Object.fromEntries( EMOTES.map( name => [ name, () => this.playEmote( name ) ] ) )

    void this.loadModel()
  }

  private async loadModel() {
    try {
      const gltf = await new GLTFLoader().loadAsync( 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb' )

      const model = gltf.scene
      model.name = 'RobotExpressive'
      this.model = model
      this.scene.add( model )

      this.mixer = new AnimationMixer( model )

      for ( let i = 0; i < gltf.animations.length; i ++ ) {

        const clip = gltf.animations[ i ]
        const action = this.mixer.clipAction( clip )
        this.actions[ clip.name ] = action

        if ( EMOTES.indexOf( clip.name ) >= 0 || STATES.indexOf( clip.name ) >= 4 ) {

          action.clampWhenFinished = true
          action.loop = LoopOnce

        }

      }

      // expressions

      const face = model.getObjectByName( 'Head_4' ) as Mesh
      const influences = face.morphTargetInfluences!
      const expressions: Record<string, number> = {}

      for ( const [ key, index ] of Object.entries( face.morphTargetDictionary! ) ) {
        Object.defineProperty( expressions, key, {
          get: () => influences[ index ],
          set: ( value: number ) => { influences[ index ] = value },
          enumerable: true,
        } )
      }

      this.expressions = expressions

      this.activeAction = this.actions[ this.state ]
      this.activeAction.play()

      this.notify({kind: 'structure'})
      this.dispatch('frame-object', {object: model}, true)
    } catch ( e ) {
      console.error( e )
    }
  }

  stateChanged() {
    this.fadeToAction( this.state, 0.5 )
  }

  /** A slider moved: the face's influences changed in place. */
  expressionsMutated() {
    this.notify({kind: 'geometry'})
  }

  private playEmote(name: string) {
    this.fadeToAction( name, 0.2 )
    this.mixer.addEventListener( 'finished', this.restoreState )
  }

  private restoreState = () => {
    this.mixer.removeEventListener( 'finished', this.restoreState )
    this.fadeToAction( this.state, 0.2 )
  }

  private fadeToAction(name: string, duration: number) {
    const previousAction = this.activeAction
    const activeAction = this.actions[ name ]
    if ( ! previousAction || ! activeAction ) return

    this.activeAction = activeAction

    if ( previousAction !== activeAction ) {

      previousAction.fadeOut( duration )

    }

    activeAction
      .reset()
      .setEffectiveTimeScale( 1 )
      .setEffectiveWeight( 1 )
      .fadeIn( duration )
      .play()
  }

  /**
   * Playback and frame steps forward advance the mixer. Time going back (a loop wrap, scrubbing or stepping back) is
   * ignored: the robot's state only moves forward, like a game clock.
   */
  override onAnimate(delta: number) {
    if ( delta > 0 ) this.mixer.update( delta )
  }
}

registerEditorConfig(AnimationSkinningMorphExample, [
  ['state', ioOptionSelect({model: new Menu({options: STATES})})],
  ['emotes', ioObject({expanded: true})],
  ['expressions', ioObject({expanded: true, config: [[Number, ioNumberSlider({min: 0, max: 1, step: 0.01})]]})],
])

registerEditorGroups(AnimationSkinningMorphExample, {
  Main: ['state', 'emotes', 'expressions'],
  Hidden: ['model', 'mixer', 'actions', 'activeAction', 'restoreState'],
})

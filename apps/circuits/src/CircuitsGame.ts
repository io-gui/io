import { IoElement, Register, ReactiveProperty, IoElementProps, div, WithBinding, ListenerDefinitions } from '@io-gui/core'
import { ioButton } from '@io-gui/inputs'
import { Game } from './game/game.js'
import { circuitsBoard } from './CircuitsBoard.js'

type CircuitsGameProps = IoElementProps & {
  level: WithBinding<string>
  game: Game
}

export class CircuitsGame extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
      :host > .game-toolbar {
        display: flex;
        gap: 2px;
        padding: 2px;
        flex-shrink: 0;
      }
      :host > .game-toolbar > io-button {
        flex: 1 1 auto;
        height: calc(var(--io_fieldHeight) * 1.5);
        display: flex;
        align-items: center;
      }
      :host > .game-toolbar > io-button > io-icon {
        margin-left: auto;
      }
      :host > .game-toolbar > io-button > span {
        margin-right: auto;
      }
    `
  }

  static get Listeners(): ListenerDefinitions {
    return {
      'game-complete': 'onGameComplete',
    }
  }

  @ReactiveProperty({value: '', type: String})
  declare level: string

  @ReactiveProperty({type: Game, init: null})
  declare game: Game

  completeFn: ((level: string, completed: boolean) => void) | null = null

  constructor(args: CircuitsGameProps) { super(args) }

  ready() {
    this.changed()
  }

  onGameComplete(event: CustomEvent<{ level: string; completed: boolean }>) {
    if (this.completeFn) this.completeFn(event.detail.level, event.detail.completed)
  }

  changed() {
    this.render([
      circuitsBoard({id: 'board', game: this.game}),
      div({class: 'game-toolbar'}, [
        ioButton({label: 'Undo', icon: 'io:undo', action: this.onUndo}),
        ioButton({label: 'Reset', icon: 'io:reload', action: this.onReset}),
        ioButton({label: 'Redo', icon: 'io:redo', action: this.onRedo}),
      ]),
    ])
  }

  levelChanged() {
    this.game.currentLevel = this.level
  }

  onUndo() {
    this.game.undo()
  }

  onRedo() {
    this.game.redo()
  }

  onReset() {
    this.game.reload()
  }

  onEdit() {
    this.changed()
  }

}

Register(CircuitsGame)

export const circuitsGame = function(arg0: CircuitsGameProps) {
  return CircuitsGame.vConstructor(arg0)
}

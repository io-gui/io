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
    `
  }

  static get Listeners(): ListenerDefinitions {
    return {
      "game-complete": "onGameComplete",
    };
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
      div({class: 'game-toolbar'}, [
        ioButton({label: 'Undo', action: this.onUndo}),
        ioButton({label: 'Edit', action: this.onEdit}),
        ioButton({label: 'Reset', action: this.onReset}),
        ioButton({label: 'Redo', action: this.onRedo}),
        ioButton({label: 'Back', action: this.onBack}),
      ]),
      circuitsBoard({id: 'board', game: this.game}),
    ])
  }

  levelChanged() {
    this.game.currentLevel = this.level
    const board = this.querySelector('circuits-board') as IoElement | null
    if (board) (board as any).gameChanged()
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

  onBack() {
    this.dispatch('back-to-levels', undefined, true)
  }
}

Register(CircuitsGame)

export const circuitsGame = function(arg0: CircuitsGameProps) {
  return CircuitsGame.vConstructor(arg0)
}

import { IoElement, Register, ReactiveProperty, IoElementProps, div, WithBinding } from '@io-gui/core'
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

  @ReactiveProperty({value: '', type: String})
  declare level: string

  @ReactiveProperty({type: Game, init: null})
  declare game: Game

  saveFn: ((level: string, json: string) => void) | null = null;
  completeFn: ((level: string, completed: boolean) => void) | null = null;

  constructor(args: CircuitsGameProps) { super(args) }

  ready() {
    this.game.onSave = (level: string, json: string) => {
      if (this.saveFn) this.saveFn(level, json);
    };
    this.game.onComplete = (level: string, completed: boolean) => {
      if (this.completeFn) this.completeFn(level, completed);
    };
    this.changed()
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
    if (!this.level) {
      this.game.clear();
      return;
    }
    const savedState = localStorage.getItem(this.level) || undefined;
    this.game.load(this.level, savedState);
    const board = this.querySelector('circuits-board') as IoElement | null;
    if (board) (board as any).gameChanged();
  }

  onUndo() {
    this.game.undo();
  }

  onRedo() {
    this.game.redo();
  }

  onReset() {
    this.game.reset(this.level);
  }

  onEdit() {
    this.changed();
  }

  onBack() {
    this.dispatch('back-to-levels', undefined, true);
  }
}

Register(CircuitsGame)

export const circuitsGame = function(arg0: CircuitsGameProps) {
  return CircuitsGame.vConstructor(arg0)
}

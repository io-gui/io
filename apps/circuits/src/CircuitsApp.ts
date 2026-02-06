import { Register, IoElement, ReactiveProperty, Storage as $, ListenerDefinitions } from '@io-gui/core'
import { ioSplit, Split } from '@io-gui/layout'

import { circuitsLevels } from './CircuitsLevels.js'
import { circuitsGame } from './CircuitsGame.js'
import { circuitsEditor } from './CircuitsEditor.js'
import { Game } from './game/game.js'

$.permit()
const $level = $({key: 'level', storage: 'hash', value: ''})

@Register
export class CircuitsApp extends IoElement {
  static get Style() {
    return /* css */`
      :host {
        display: flex;
        position: fixed;
        inset: 0;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        background-color: #407bfb;
        color: #fff;
        user-select: none;
        -webkit-user-select: none;
        -webkit-text-size-adjust: none;
        -webkit-touch-callout: none;
      }
    `
  }

  @ReactiveProperty({type: Game, init: null})
  declare game: Game

  static get Listeners(): ListenerDefinitions {
    return {
      'level-select': 'onLevelSelect',
      'editor-select': 'onEditorSelect',
    }
  }

  ready() {
    this.render([
      ioSplit({
        split: new Split({
          type: 'split',
          children: [
            {type: 'panel',
              flex: '0 0 260px',
              tabs: [
                {id: 'levels'},
              ],
            },
            {type: 'panel',
              flex: '1 1 auto',
              tabs: [
                {id: 'game'},
              ],
            },
            {type: 'panel',
              flex: '0 0 260px',
              tabs: [
                {id: 'editor'},
              ],
            },
          ]
        }),
        elements: [
          circuitsLevels({id: 'levels'}),
          circuitsGame({id: 'game', level: $level, game: this.game}),
          circuitsEditor({id: 'editor'}),
        ],
      }),
    ])
  }

  onEditorSelect(event: CustomEvent) {
    event.stopPropagation();
    const { mode, color } = event.detail;
    this.game.drawMode = mode;
    this.game.drawColor = color;
    this.changed();
  }

  onLevelSelect(event: CustomEvent) {
    event.stopPropagation();
    const { level } = event.detail;
    $level.value = level;
  }
}

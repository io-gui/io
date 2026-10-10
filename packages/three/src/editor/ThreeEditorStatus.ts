import { Property, ReactiveElement, ReactiveElementProps, div, span, Register } from '@io-gui/core'
import { ThreeEditor } from './ThreeEditor.js'
import type { ThreeDocument } from './ThreeDocument.js'

interface ThreeEditorStatusProps extends ReactiveElementProps {
  editor: ThreeEditor
}

@Register
export class ThreeEditorStatus extends ReactiveElement {

  static override get Style() {
    return /* css */`
      :host {
        padding: var(--io_spacing2);
        border: var(--io_border);
        border-color: var(--io_borderColorInset);
        box-shadow: var(--io_shadowInset);
        color: var(--io_colorBlue);
      }
    `
  }

  @Property({type: ThreeEditor})
  declare editor: ThreeEditor

  /** The document whose commits are listened to; follows `editor.document`. */
  declare private _document: ThreeDocument | undefined

  constructor(props: ThreeEditorStatusProps) {
    super(props)
    this.editor = props.editor
  }

  override ready() {
    this.editorMutated()
  }

  editorMutated() {
    const document = this.editor.document
    if (document !== this._document) {
      this._document?.removeEventListener('commit', this.onCommit)
      document.addEventListener('commit', this.onCommit)
      this._document = document
    }
    this.changed()
  }

  onCommit() {
    this.changed()
  }

  changed() {
    const cmd = this.editor.operators.lastCommand
    const last = cmd ? `${cmd.name} ${JSON.stringify(cmd.args)}` : 'none'
    this.render([
        div({class: 'status'}, [span(`Last command: ${last}`)]),
    ])
  }
}

export const threeEditorStatus = (props: ThreeEditorStatusProps) => ThreeEditorStatus.vConstructor(props)
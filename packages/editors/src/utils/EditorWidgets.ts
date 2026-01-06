import { AnyConstructor, VDOMElement } from '@io-gui/core'

export type EditorWidgets = Map<AnyConstructor, VDOMElement>

const editorWidgetsSingleton: EditorWidgets = new Map<AnyConstructor, VDOMElement>([
  // TODO: remove outerHTML debug view
  // [HTMLElement, {tag: 'io-property-editor', props: {properties: ['outerHTML'], config: [['outerHTML', div()]]]
  // ]), labeled: false}}],
])

export function getEditorWidget(object: object): VDOMElement | null {
  debug: if (!object || !(object instanceof Object)) {
    console.warn('`getEditorGroups` should be used with an Object instance')
    return null
  }

  function getWidget(editorWidgets: EditorWidgets) {
    let matchedWidget = null
    for (const [constructorKey, widgetCandidate] of editorWidgets) {
      if (object instanceof constructorKey) {
        matchedWidget = widgetCandidate
      }
    }
    return matchedWidget
  }

  return getWidget(editorWidgetsSingleton)
}

export function registerEditorWidget(constructor: AnyConstructor, widget: VDOMElement) {
  editorWidgetsSingleton.set(constructor, widget)
}

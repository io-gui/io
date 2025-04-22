import { AnyConstructor, VDOMElement } from 'io-gui';
import { ioField } from 'io-inputs';

export type EditorWidgets = Map<AnyConstructor, VDOMElement>

const editorWidgetsSingleton: EditorWidgets = new Map<AnyConstructor, VDOMElement>([
  [HTMLElement, ioField()],
]);

export function getEditorWidget(object: object, editorWidgets: EditorWidgets = new Map()): VDOMElement | null {
  debug: if (!object || !(object instanceof Object)) {
    console.warn('`getEditorGroups` should be used with an Object instance');
    return null;
  }

  function getWidget(editorWidgets: EditorWidgets) {
    let matchedWidget = null;
    for (const [constructorKey, widgetCandidate] of editorWidgets) {
      if (object instanceof constructorKey) {
        matchedWidget = widgetCandidate;
      }
    }
    return matchedWidget;
  }

  let widget = getWidget(editorWidgetsSingleton);
  widget = getWidget(editorWidgets) || widget;

  return widget;
}

export function registerEditorWidget(constructor: AnyConstructor, widget: VDOMElement) {
  editorWidgetsSingleton.set(constructor, widget);
}

const editorWidgetsSingleton = new Map([
// TODO: remove outerHTML debug view
// [HTMLElement, {tag: 'io-property-editor', props: {properties: ['outerHTML'], config: new Map([
//   [HTMLElement, [['outerHTML', div()]]]
// ]), labeled: false}}],
]);
export function getEditorWidget(object, editorWidgets = new Map()) {
    debug: if (!object || !(object instanceof Object)) {
        console.warn('`getEditorGroups` should be used with an Object instance');
        return null;
    }
    function getWidget(editorWidgets) {
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
export function registerEditorWidget(constructor, widget) {
    editorWidgetsSingleton.set(constructor, widget);
}
//# sourceMappingURL=EditorWidgets.js.map
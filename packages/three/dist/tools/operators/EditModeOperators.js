import { getEditObjects, getGeometryAdapter } from '../../geometry/GeometryAdapter.js';
import { convertComponents } from '../../geometry/componentDomains.js';
/**
 * Enters or leaves edit mode (Blender's `object.editmode_toggle`). Entering needs a selected object with a
 * geometry adapter; the selection's domain becomes the last component domain, and `'object'` on leaving.
 * Mode and selection are session state, so the operator's transaction stays empty.
 */
class EditModeToggleOperator {
    poll(ctx) {
        return ctx.editor.mode === 'edit' || getEditObjects(ctx.editor.selection.getObjects()).length > 0;
    }
    exec(ctx) {
        const editor = ctx.editor;
        const selection = editor.selection;
        if (editor.mode === 'edit') {
            if (selection.domain !== 'object')
                selection.componentDomain = selection.domain;
            selection.edit().setDomain('object').commit();
            editor.mode = 'object';
        }
        else {
            selection.edit().setDomain(selection.componentDomain).commit();
            editor.mode = 'edit';
        }
        return 'finished';
    }
}
/**
 * Switches the component select mode (Blender's `mesh.select_mode`), converting each edit object's
 * selection: down (face → edge → point) keeps everything touched, up keeps elements fully selected.
 * Objects whose adapter lacks the domain keep their selection.
 */
class SelectModeOperator {
    props;
    constructor(props) {
        this.props = props;
    }
    poll(ctx) {
        return ctx.editor.mode === 'edit' && !!this.props.domain && this.props.domain !== 'object';
    }
    exec(ctx) {
        const selection = ctx.editor.selection;
        const from = selection.domain;
        const to = this.props.domain;
        if (from === to)
            return 'cancelled';
        const edit = selection.edit();
        for (const object of getEditObjects(selection.getObjects())) {
            const adapter = getGeometryAdapter(object);
            if (!adapter.domains.includes(to))
                continue;
            const topology = adapter.getTopology(object);
            const converted = convertComponents(topology, from, selection.getComponents(object.uuid, from), to);
            edit.components(object.uuid, to, converted.size).words.set(converted.words);
        }
        edit.setDomain(to).commit();
        selection.componentDomain = to;
        return 'finished';
    }
}
export const editModeToggleOperatorType = {
    id: 'object.editmode_toggle',
    label: 'Toggle Edit Mode',
    create: () => new EditModeToggleOperator(),
};
export const selectModeOperatorType = {
    id: 'mesh.select_mode',
    label: 'Select Mode',
    create: props => new SelectModeOperator(props),
};

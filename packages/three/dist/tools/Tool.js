export class ToolRegistry {
    _tools = new Map();
    register(tool) {
        debug: {
            if (this._tools.has(tool.id))
                console.warn(`ToolRegistry: replacing tool "${tool.id}"`);
        }
        this._tools.set(tool.id, tool);
    }
    get(id) {
        return this._tools.get(id);
    }
    /** Tools available for a view kind and mode. */
    list(viewKind, mode) {
        return [...this._tools.values()].filter(tool => (!viewKind || tool.viewKinds.includes(viewKind)) && (!mode || tool.modes.includes(mode)));
    }
}
export function toolAllowsProfile(tool, profile) {
    return (tool.profiles ?? ['full']).includes(profile);
}

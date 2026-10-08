/** Definitions by id: pipelines, overlays, tools, operators. Registering an id again replaces it. */
export class Registry {
    _items = new Map();
    register(item) {
        this._items.set(item.id, item);
        return this;
    }
    get(id) {
        return this._items.get(id);
    }
    list(filter) {
        const items = [...this._items.values()];
        return filter ? items.filter(filter) : items;
    }
}

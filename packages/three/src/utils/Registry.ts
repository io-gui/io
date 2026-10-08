/** Definitions by id: pipelines, overlays, tools, operators. Registering an id again replaces it. */
export class Registry<T extends {readonly id: string}> {

  private readonly _items = new Map<string, T>()

  register(item: T) {
    this._items.set(item.id, item)
    return this
  }

  get(id: string): T | undefined {
    return this._items.get(id)
  }

  list(filter?: (item: T) => boolean): T[] {
    const items = [...this._items.values()]
    return filter ? items.filter(filter) : items
  }
}

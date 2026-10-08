/** Definitions by id: pipelines, overlays, tools, operators. Registering an id again replaces it. */
export declare class Registry<T extends {
    readonly id: string;
}> {
    private readonly _items;
    register(item: T): this;
    get(id: string): T | undefined;
    list(filter?: (item: T) => boolean): T[];
}

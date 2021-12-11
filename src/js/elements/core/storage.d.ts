interface StorageProps {
    key: string;
    value?: unknown;
    storage?: 'hash' | 'local';
}
declare const IoStorageFactory: (props: StorageProps) => any;
export { IoStorageFactory };
//# sourceMappingURL=storage.d.ts.map
type BenchOptions = {
    time?: number;
    warmupTime?: number;
    warmupIterations?: number;
    iterations?: number;
};
export declare function bench(name: string, fn: () => void | Promise<void>, options?: BenchOptions): void;
export {};

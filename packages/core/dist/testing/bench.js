import { bench as vitestBench } from 'vitest';
const STABLE_BENCH_OPTIONS = {
    time: 3000,
    warmupTime: 500,
    warmupIterations: 10,
    iterations: 20,
};
export function bench(name, fn, options = {}) {
    return vitestBench(name, fn, { ...STABLE_BENCH_OPTIONS, ...options });
}

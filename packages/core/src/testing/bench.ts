import { bench as vitestBench } from 'vitest'

type BenchOptions = {
  time?: number
  warmupTime?: number
  warmupIterations?: number
  iterations?: number
}

const STABLE_BENCH_OPTIONS: BenchOptions = {
  time: 3000,
  warmupTime: 500,
  warmupIterations: 10,
  iterations: 20,
}

export function bench(
  name: string,
  fn: () => void | Promise<void>,
  options: BenchOptions = {},
) {
  return vitestBench(name, fn, { ...STABLE_BENCH_OPTIONS, ...options })
}

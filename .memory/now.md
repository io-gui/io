# Current Focus

Parallel binding networks race: two independent prop networks (a vs b) batch-updated via setProperties; first network settles+flushes while second still stale → Sink.mutated()/io-mutation sees `A1|` then `A1|B1`.

Failing test in Binding.network.test.ts — no fix yet.

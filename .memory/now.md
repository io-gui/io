# Current Focus

Binding forward-sync is now a transitive graph write (`pushBindingValue`) then flush dirty queues. Network + single-hub suites green (64).

Architectural shift: hub→spoke sync is graph settlement, not per-hub event cascade.

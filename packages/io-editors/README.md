## Io-Editors - Metadata-Driven Universal Editor Architecture

The io-editors package implements what I'd call a Configuration-Driven Metadata Architecture - a sophisticated pattern that's quite different from traditional MVVM.

Hierarchical configuration inheritance

The Core Components: Groups and Configs

EditorConfig - Widget Selection Strategy

Multi-Strategy Widget Selection:
- Type-based: Number → ioNumberSlider
- Name-based: 'role' → ioOptionSelect
- RegExp-based: /^aria-/ → ioString
- Hierarchical inheritance: Child classes inherit parent configs with override capability

EditorGroups - Semantic Property Categorization

This enables editing ANY JavaScript object without pre-configuration!
---
name: Core Library Improvements
overview: Address foundational issues in @io-gui/core including memory leaks, performance optimizations, error handling, and API improvements. Issues are prioritized by urgency and impact.
todos:
  - id: typescript-improvements
    content: Improve TypeScript types (replace any, add generics)
    status: pending
  - id: nodearray-complete
    content: Implement fill() and copyWithin() in NodeArray
    status: completed
  - id: computed-properties
    content: Design and implement @Computed decorator (future)
    status: pending
  - id: serialization-utils
    content: Add toJSON/fromJSON serialization utilities (future)
    status: pending
---

# Core Library Improvements Plan

## Phase 1: Type Improvements

### 1.1 TypeScript Type Improvements

Replace `any` types with proper generics and interfaces throughout the codebase.

### 1.2 Complete NodeArray Implementation
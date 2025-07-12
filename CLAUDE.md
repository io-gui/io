# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Io-Gui is a reactive web UI framework focused on simplicity and performance. It creates reactive nodes and custom elements that respond to state changes, data binding events, and object mutations. The framework includes a design system with UI components and supports WebGL-rendered elements using GLSL shaders.

## Development Commands

### Package Manager
This project uses `pnpm` as the package manager.

### Essential Commands
- `pnpm dev` - Start watch mode for all packages (TypeScript compilation)
- `pnpm dev:gui` - Start watch mode for core io-gui package only
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages (auto-fixes)
- `pnpm test` - Run tests with web-test-runner
- `pnpm test:watch` - Run tests in watch mode
- `pnpm serve` - Start @web/dev-server for development
- `pnpm clean` - Clean all build directories

### Package-Specific Commands
Each package can be built/linted individually:
- `pnpm build:gui`, `pnpm build:colors`, `pnpm build:inputs`, etc.
- `pnpm lint:gui`, `pnpm lint:colors`, `pnpm lint:inputs`, etc.

### Bundle Commands
- `pnpm bundle` - Create optimized bundles for all packages
- Individual bundle commands available: `pnpm bundle:gui`, `pnpm bundle:colors`, etc.

## Architecture

### Monorepo Structure
The project is organized as a monorepo with packages in `/packages/`:

- **io-gui** - Core framework (Node, IoElement, bindings, reactivity)
- **io-colors** - Color components and utilities
- **io-icons** - Icon system and components
- **io-inputs** - Input controls (buttons, fields, switches)
- **io-layout** - Layout components (panels, tabs, splits)
- **io-editors** - Object and property editors
- **io-markdown** - Markdown rendering
- **io-menus** - Menu and context menu components
- **io-navigation** - Navigation and selection components
- **io-sliders** - Slider controls
- **io-monolith** - Combined package with all components

### Core Concepts

#### Reactive Data Flow
- Data flows trunk-to-leaf using change handlers:
  - Generic: `.changed()`
  - Specific: `.[prop]Changed()`
- Bi-directional binding via `.bind([prop])` and change events
- Object mutations flow leaf-to-trunk and are debounced/aggregated

#### Base Classes
- **Node** - Base reactive class extending Object with property binding and change detection
- **IoElement** - Web component base class extending HTMLElement with Node functionality

#### Key Systems
- **ReactiveProperty** - Decorator for reactive properties with change detection
- **Binding** - System for connecting properties between objects
- **ChangeQueue** - Batches and manages property changes
- **VDOM** - Virtual DOM implementation for efficient rendering
- **ProtoChain** - Manages prototype chain for inheritance

### Build System
- Uses `wireit` for orchestrated builds with dependency management
- TypeScript compilation with `tsc`
- Rollup for bundling with tree-shaking
- ESLint for linting with auto-fix

### Testing
- Uses Chai and Mocha for testing
- Web Test Runner for browser-based tests
- Test files follow `*.test.ts` pattern

## Code Style Guidelines

### From Cursor Rules
- Code should require minimal documentation: "Code is documentation"
- Use clear, descriptive, and easy-to-read variable/property names
- Don't solve problems by removing debug statements/checks
- Follow existing code style and linting patterns

### TypeScript Patterns
- Extensive use of decorators (`@ReactiveProperty`, `@Register`, `@Property`)
- Strong typing with interfaces and type definitions
- ES modules with `.js` extensions in imports

### Component Structure
- Elements extend `IoElement` and use reactive properties
- Nodes extend `Node` for non-DOM reactive objects
- CSS styles defined in static `Style` getter
- Properties defined in static `ReactiveProperties` and `Properties` getters

## Development Workflow

1. Run `pnpm dev` to start watch mode for all packages
2. Run `pnpm serve` to start development server
3. Make changes to source files in `/packages/*/src/`
4. TypeScript will compile to `/packages/*/build/`
5. Use `pnpm lint` to fix linting issues
6. Use `pnpm test` to run tests

## Important Notes

- Always run `pnpm lint` after making changes to ensure code style compliance
- The framework has no runtime dependencies - only development dependencies
- WebGL elements extend `IoGL` and can use GLSL shaders
- Theme system uses CSS variables that map to JavaScript objects and GLSL uniforms
- All packages have circular dependencies managed through the build system ordering
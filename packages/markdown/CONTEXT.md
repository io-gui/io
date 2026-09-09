# Markdown

The `@io-gui/markdown` context: fetch-and-render markdown into sanitized, syntax-highlighted HTML inside one element. Integrates with theme and with navigation anchors.

## Language

**data-heading**:
Attribute stamped on rendered headings so navigation Anchor sync can scroll to and report section ids.
_Avoid_: anchor id, heading id (as the attribute name)

**Strip**:
Regex patterns applied to raw markdown (or intermediate HTML) to remove marked regions before display.
_Avoid_: filter, exclude blocks

**Highlight theme**:
Syntax-highlight stylesheet pair that follows `ThemeSingleton.themeID` (light vs dark code blocks).
_Avoid_: highlight.js theme name (as the Io-Gui term)

**Sanitize**:
DOMPurify gate on rendered HTML. Default on; only trusted sources should disable it.
_Avoid_: XSS filter, purify flag (as domain names)

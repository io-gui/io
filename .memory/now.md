# Current Focus

Safari WebKit bug: `:host[loading]:after` spinner visible without `[loading]` attr. Fix: base `[loading]` rule + `:host:not([loading]):after` reset in IoSelector (and IoMarkdown same pattern).

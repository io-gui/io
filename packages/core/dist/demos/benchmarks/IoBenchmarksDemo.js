//@ts-nocheck
import { IoElement, Register, div, h2, h3, p, table, thead, tbody, tr, th, td } from '@io-gui/core';
const RESULTS_URL = '/benchmarks/results.json';
function formatDuration(seconds) {
    if (seconds === null)
        return '—';
    if (seconds < 0.000001)
        return `${(seconds * 1e9).toFixed(1)} ns`;
    if (seconds < 0.001)
        return `${(seconds * 1e6).toFixed(1)} µs`;
    if (seconds < 1)
        return `${(seconds * 1000).toFixed(3)} ms`;
    return `${seconds.toFixed(3)} s`;
}
function formatMargin(rme) {
    if (rme === null)
        return '—';
    return `${rme.toFixed(2)}%`;
}
function labelAfterArrow(fullName) {
    const index = fullName.lastIndexOf(' > ');
    return index === -1 ? fullName : fullName.slice(index + 3);
}
/** @internal Demo: vitest bench results from benchmarks/results.json. */
export class IoBenchmarksDemo extends IoElement {
    static get Style() {
        return /* css */ `
    :host {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: var(--io_spacing3);
      padding: var(--io_spacing3);
      overflow: auto;
    }
    :host table {
      width: 100%;
      border-collapse: collapse;
      font-variant-numeric: tabular-nums;
    }
    :host th, :host td {
      padding: var(--io_spacing) var(--io_spacing2);
      border-bottom: var(--io_border);
      text-align: left;
    }
    :host th {
      color: var(--io_colorLight);
      font-weight: normal;
    }
    :host .mean, :host .median, :host .margin {
      text-align: right;
    }
    :host .group {
      display: flex;
      flex-direction: column;
      gap: var(--io_spacing);
    }
    :host .path {
      color: var(--io_colorLight);
      font-size: 0.875em;
    }
    :host .error {
      color: var(--io_colorRed);
    }
    `;
    }
    #status = 'loading';
    #report = null;
    #error = null;
    ready() {
        fetch(RESULTS_URL)
            .then(res => {
            if (!res.ok)
                throw new Error(`${res.status} ${res.statusText}`);
            return res.json();
        })
            .then(json => {
            this.#report = json;
            this.#status = 'ready';
            this.changed();
        })
            .catch(err => {
            this.#error = err.message || String(err);
            this.#status = 'error';
            this.changed();
        });
    }
    changed() {
        if (this.#status === 'loading') {
            this.render([p('Loading benchmark results…')]);
            return;
        }
        if (this.#status === 'error') {
            this.render([p({ class: 'error' }, `Failed to load ${RESULTS_URL}: ${this.#error}`)]);
            return;
        }
        this.render([
            h2('Benchmarks'),
            p({ class: 'path' }, RESULTS_URL),
            ...this.#report.files.flatMap(file => file.groups.map(group => this.renderGroup(group))),
        ]);
    }
    renderGroup(group) {
        return div({ class: 'group' }, [
            h3(labelAfterArrow(group.fullName)),
            table([
                thead([
                    tr([
                        th('Name'),
                        th({ class: 'mean' }, 'Mean'),
                        th({ class: 'median' }, 'Median'),
                        th({ class: 'margin' }, 'Margin'),
                    ]),
                ]),
                tbody(group.benchmarks.map(benchmark => tr([
                    td({ class: 'name' }, benchmark.name),
                    td({ class: 'mean' }, formatDuration(benchmark.mean)),
                    td({ class: 'median' }, formatDuration(benchmark.median)),
                    td({ class: 'margin' }, formatMargin(benchmark.rme)),
                ]))),
            ]),
        ]);
    }
}
Register(IoBenchmarksDemo);
export const ioBenchmarksDemo = IoBenchmarksDemo.vConstructor;
//# sourceMappingURL=IoBenchmarksDemo.js.map
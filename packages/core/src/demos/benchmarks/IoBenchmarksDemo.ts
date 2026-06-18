//@ts-nocheck
import { IoElement, Register, div, h2, h3, p, table, thead, tbody, tr, th, td } from '@io-gui/core'

const RESULTS_URL = './benchmarks/results.json'
const BASELINE_URL = './benchmarks/results-baseline.json'

const COMPARISON_METRICS = [
  { key: 'mean', label: 'Mean', format: formatDuration },
  { key: 'median', label: 'Median', format: formatDuration },
] as const

const MARGIN_KEY = 'rme'

function formatDuration(ms: number | undefined) {
  if (ms === null) return 'NA'
  if (ms === 0) return '—'
  if (ms < 0.001) return `${(ms * 1e6).toFixed(1)} ns`
  if (ms < 1) return `${(ms * 1000).toFixed(1)} µs`
  if (ms < 1000) return `${ms.toFixed(3)} ms`
  return `${(ms / 1000).toFixed(3)} s`
}

function formatMargin(rme: number | undefined) {
  if (rme === null) return 'NA'
  return `${rme.toFixed(2)}%`
}

function averageMargin(baseline: number | undefined, current: number | undefined) {
  if (baseline === null && current === null) return undefined
  if (baseline === null) return current
  if (current === null) return baseline
  return (baseline + current) / 2
}

function formatDeltaPercent(baseline: number | undefined, current: number | undefined) {
  if (baseline === null || current === null) return 'NA'
  if (baseline === 0 && current === 0) return '0.0%'
  if (baseline === 0) return 'NA'
  const pct = ((current - baseline) / baseline) * 100
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1)}%`
}

function metricValue(benchmark: Record<string, number | string> | undefined, key: string) {
  if (!benchmark) return undefined
  const value = benchmark[key]
  return typeof value === 'number' ? value : undefined
}

function labelAfterArrow(fullName: string) {
  const index = fullName.lastIndexOf(' > ')
  return index === -1 ? fullName : fullName.slice(index + 3)
}

function benchmarkKey(groupName: string, name: string) {
  return `${groupName}\0${name}`
}

type BenchmarkMetrics = Record<string, number | string | undefined>

type NormalizedGroup = {
  fullName: string
  benchmarks: Array<{ name: string; metrics: BenchmarkMetrics }>
}

type NormalizedReport = {
  groups: NormalizedGroup[]
}

function latencyMetrics(latency: Record<string, number> | undefined): BenchmarkMetrics {
  if (!latency) return {}
  return {
    mean: latency.mean,
    median: latency.p50,
    rme: latency.rme,
  }
}

function normalizeReport(raw: unknown): NormalizedReport | null {
  if (!raw || typeof raw !== 'object') return null
  const report = raw as Record<string, unknown>

  if (Array.isArray(report.testResults)) {
    const groups: NormalizedGroup[] = []
    for (const file of report.testResults) {
      for (const assertion of file?.assertionResults ?? []) {
        const benchmarks: NormalizedGroup['benchmarks'] = []
        for (const benchmark of assertion.benchmarks ?? []) {
          for (const task of benchmark.tasks ?? []) {
            benchmarks.push({
              name: task.name,
              metrics: latencyMetrics(task.latency),
            })
          }
        }
        groups.push({ fullName: assertion.fullName, benchmarks })
      }
    }
    return { groups }
  }

  if (Array.isArray(report.files)) {
    const groups: NormalizedGroup[] = []
    for (const file of report.files) {
      for (const group of file.groups ?? []) {
        groups.push({
          fullName: group.fullName,
          benchmarks: (group.benchmarks ?? []).map((benchmark: Record<string, unknown>) => ({
            name: String(benchmark.name),
            metrics: benchmark as BenchmarkMetrics,
          })),
        })
      }
    }
    return { groups }
  }

  return null
}

function indexBenchmarks(report: NormalizedReport | null) {
  const map = new Map<string, BenchmarkMetrics>()
  if (!report) return map
  for (const group of report.groups) {
    for (const benchmark of group.benchmarks) {
      map.set(benchmarkKey(group.fullName, benchmark.name), benchmark.metrics)
    }
  }
  return map
}

function collectGroupNames(current: NormalizedReport, baseline: NormalizedReport | null) {
  const names = new Set<string>()
  for (const group of current.groups) names.add(group.fullName)
  if (baseline) {
    for (const group of baseline.groups) names.add(group.fullName)
  }
  return [...names].sort((a, b) => a.localeCompare(b))
}

function collectBenchmarkNames(
  groupName: string,
  current: NormalizedReport,
  baseline: NormalizedReport | null,
) {
  const names = new Set<string>()
  for (const group of current.groups) {
    if (group.fullName !== groupName) continue
    for (const benchmark of group.benchmarks) names.add(benchmark.name)
  }
  if (baseline) {
    for (const group of baseline.groups) {
      if (group.fullName !== groupName) continue
      for (const benchmark of group.benchmarks) names.add(benchmark.name)
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b))
}
export class IoBenchmarksDemo extends IoElement {
  static get Style() {
    return /* css */`
    :host {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      gap: var(--io_spacing3);
      padding: var(--io_spacing3);
      overflow: auto;
    }
    :host .table-wrap {
      overflow-x: auto;
    }
    :host table {
      width: 100%;
      border-collapse: collapse;
      font-variant-numeric: tabular-nums;
      font-size: 0.875em;
    }
    :host thead th {
      background: color-mix(in srgb, var(--io_colorLight) 8%, transparent);
      vertical-align: bottom;
      white-space: nowrap;
    }
    :host th, :host td {
      padding: var(--io_spacing) var(--io_spacing2);
      border-bottom: var(--io_border);
      text-align: left;
    }
    :host th.name-head {
      min-width: 12em;
      vertical-align: bottom;
    }
    :host th.metric-head {
      text-align: center;
      border-left: var(--io_border);
      padding-bottom: var(--io_spacing);
    }
    :host th.metric-head.margin-head {
      text-align: right;
      vertical-align: bottom;
    }
    :host th.subhead {
      text-align: right;
      font-size: 0.85em;
      color: var(--io_colorLight);
      padding-top: 0;
    }
    :host th.subhead.group-start {
      border-left: var(--io_border);
    }
    :host tbody tr:nth-child(even) td {
      background: color-mix(in srgb, var(--io_colorLight) 4%, transparent);
    }
    :host td.name {
      white-space: nowrap;
    }
    :host .numeric {
      text-align: right;
      white-space: nowrap;
    }
    :host td.baseline {
      color: var(--io_colorLight);
    }
    :host td.baseline.group-start {
      border-left: var(--io_border);
    }
    :host .delta {
      text-align: right;
      font-weight: 500;
      white-space: nowrap;
    }
    :host .delta.slower {
      color: var(--io_colorRed);
    }
    :host .delta.faster {
      color: var(--io_colorGreen);
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
    :host .notice {
      color: var(--io_colorLight);
    }
    `
  }

  #status = 'loading'
  #report = null
  #baseline = null
  #baselineMissing = false
  #error = null

  ready() {
    Promise.all([
      fetch(RESULTS_URL).then(res => {
        if (!res.ok) throw new Error(`${RESULTS_URL}: ${res.status} ${res.statusText}`)
        return res.json()
      }),
      fetch(BASELINE_URL).then(res => {
        if (!res.ok) {
          this.#baselineMissing = true
          return null
        }
        return res.json()
      }),
    ])
      .then(([current, baseline]) => {
        const report = normalizeReport(current)
        if (!report) throw new Error('Unrecognized benchmark report format')
        this.#report = report
        this.#baseline = baseline ? normalizeReport(baseline) : null
        if (baseline && !this.#baseline) throw new Error('Unrecognized baseline report format')
        this.#status = 'ready'
        this.changed()
      })
      .catch(err => {
        this.#error = err.message || String(err)
        this.#status = 'error'
        this.changed()
      })
  }

  changed() {
    if (this.#status === 'loading') {
      this.render([p('Loading benchmark results…')])
      return
    }
    if (this.#status === 'error') {
      this.render([p({class: 'error'}, `Failed to load benchmark results: ${this.#error}`)])
      return
    }

    const baselineIndex = indexBenchmarks(this.#baseline)

    this.render([
      h2('Benchmarks'),
      p({class: 'path'}, `Current: ${RESULTS_URL}`),
      p({class: 'path'}, `Baseline: ${BASELINE_URL}`),
      this.#baselineMissing
        ? p({class: 'notice'}, 'Baseline not found — run pnpm bench:baseline to create it. Baseline columns show NA.')
        : null,
      ...collectGroupNames(this.#report, this.#baseline).map(groupName =>
        this.renderGroup(groupName, baselineIndex)
      ),
    ])
  }

  renderGroup(
    groupName: string,
    baselineIndex: Map<string, BenchmarkMetrics>,
  ) {
    const currentIndex = indexBenchmarks(this.#report)
    const benchmarkNames = collectBenchmarkNames(groupName, this.#report, this.#baseline)

    return div({class: 'group'}, [
      h3(labelAfterArrow(groupName)),
      div({class: 'table-wrap'}, [
        table([
          thead([
            tr([
              th({rowSpan: 2, class: 'name-head'}, 'Benchmark'),
              ...COMPARISON_METRICS.map(metric => th({colSpan: 3, class: 'metric-head'}, metric.label)),
              th({rowSpan: 2, class: 'metric-head margin-head'}, 'Margin'),
            ]),
            tr(COMPARISON_METRICS.flatMap((metric, index) => [
              th({class: `subhead numeric${index === 0 ? '' : ' group-start'}`}, 'Base'),
              th({class: 'subhead numeric'}, 'Now'),
              th({class: 'subhead numeric'}, 'Δ'),
            ])),
          ]),
          tbody(benchmarkNames.map(name => {
            const key = benchmarkKey(groupName, name)
            const baseline = baselineIndex.get(key)
            const current = currentIndex.get(key)

            return tr([
              td({class: 'name'}, name),
              ...COMPARISON_METRICS.flatMap((metric, index) => {
                const baselineValue = metricValue(baseline, metric.key)
                const currentValue = metricValue(current, metric.key)
                const delta = formatDeltaPercent(baselineValue, currentValue)
                const deltaClass = delta === 'NA'
                  ? 'delta'
                  : delta.startsWith('+')
                    ? 'delta slower'
                    : delta.startsWith('-')
                      ? 'delta faster'
                      : 'delta'
                const groupStart = index === 0 ? '' : ' group-start'

                return [
                  td({class: `numeric baseline${groupStart}`}, metric.format(baselineValue)),
                  td({class: 'numeric'}, metric.format(currentValue)),
                  td({class: deltaClass}, delta),
                ]
              }),
              td({class: 'numeric group-start'}, formatMargin(averageMargin(
                metricValue(baseline, MARGIN_KEY),
                metricValue(current, MARGIN_KEY),
              ))),
            ])
          })),
        ]),
      ]),
    ])
  }
}
Register(IoBenchmarksDemo)
export const ioBenchmarksDemo = IoBenchmarksDemo.vConstructor

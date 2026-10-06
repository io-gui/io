import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { IoMarkdown } from '@io-gui/markdown'
import { $ThemeID } from '@io-gui/core'

describe('IoMarkdown', () => {
  let element: IoMarkdown

  beforeEach(() => {
    element = new IoMarkdown({ sanitize: true })
    element.style.display = 'none'
    document.body.appendChild(element as HTMLElement)
  })

  afterEach(() => {
    element.remove()
    vi.restoreAllMocks()
  })

  it('is defined', () => {
    expect(IoMarkdown).toBeDefined()
  })

  it('defaults sanitize to true', () => {
    const md = new IoMarkdown()
    expect(md.sanitize).toBe(true)
    md.remove()
  })

  it('strips script tags when sanitize is enabled', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('# Title\n\n<script>alert(1)</script>'),
      ok: true,
    } as Response)

    element.src = 'unsafe.md'
    await vi.waitFor(() => expect(element.loading).toBe(false))

    expect(element.innerHTML).not.toContain('<script>')
    expect(element.innerHTML).toContain('Title')
  })

  it('keeps trusted iframe embeds when sanitize is enabled', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('<iframe src="https://www.youtube.com/embed/6JGzPLZrVFU" frameborder="0" allowfullscreen></iframe>'),
      ok: true,
    } as Response)

    element.src = 'video.md'
    await vi.waitFor(() => expect(element.loading).toBe(false))

    expect(element.innerHTML).toContain('<iframe')
    expect(element.innerHTML).toContain('youtube.com/embed/6JGzPLZrVFU')
  })

  it('strips untrusted iframe embeds when sanitize is enabled', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('<iframe src="https://evil.example.com/x"></iframe>'),
      ok: true,
    } as Response)

    element.src = 'evil.md'
    await vi.waitFor(() => expect(element.loading).toBe(false))

    expect(element.innerHTML).not.toContain('<iframe')
  })

  it('does not fetch and clears content when src is empty', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('# Title'),
      ok: true,
    } as Response)

    element.src = 'page.md'
    await vi.waitFor(() => expect(element.innerHTML).toContain('Title'))
    fetchSpy.mockClear()

    element.src = ''
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(element.innerHTML).toBe('')
    expect(element.loading).toBe(false)
  })

  it('does not fetch non-markdown sources', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    element.src = './index.html'
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(element.loading).toBe(false)
  })

  it('accepts markdown sources with query strings and hashes', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('# Title'),
      ok: true,
    } as Response)

    element.src = './docs/README.MD?v=2#intro'
    expect(fetchSpy).toHaveBeenCalledWith('./docs/README.MD?v=2#intro')
    await vi.waitFor(() => expect(element.loading).toBe(false))
    expect(element.innerHTML).toContain('Title')
  })

  it('stops loading without rendering on HTTP errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('<html>Not Found</html>'),
      ok: false,
      status: 404,
    } as Response)

    element.src = 'missing.md'
    await vi.waitFor(() => expect(element.loading).toBe(false))
    expect(element.innerHTML).toBe('')
  })

  it('should not throw when fetch completes after dispose', async () => {
    let resolveText!: (value: string) => void
    const textPromise = new Promise<string>(resolve => { resolveText = resolve })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => textPromise,
      ok: true,
    } as Response)

    element.src = 'slow.md'
    await Promise.resolve()

    element.dispose()
    resolveText('# Title')
    await textPromise
  })

  it('keeps raw html when sanitize is disabled', async () => {
    element.sanitize = false
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      text: () => Promise.resolve('<img src=x onerror=alert(1)>'),
      ok: true,
    } as Response)

    element.src = 'raw.md'
    await vi.waitFor(() => expect(element.loading).toBe(false))

    expect(element.innerHTML).toContain('<img')
  })

  it('updates highlight theme stylesheet when theme changes', () => {
    const styleElement = document.getElementById('io-highlight-theme') as HTMLStyleElement
    expect(styleElement).toBeTruthy()

    const initial = styleElement.innerHTML
    $ThemeID.value = $ThemeID.value === 'dark' ? 'light' : 'dark'
    expect(styleElement.innerHTML).not.toBe(initial)
  })
})

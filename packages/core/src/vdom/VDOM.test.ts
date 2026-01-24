import { describe, it, expect } from 'vitest'
import { Register, IoElement, applyNativeElementProps, constructElement, VDOMElement, div, span, ReactivePropertyDefinitions } from '@io-gui/core'

describe('VDOM', () => {
  it('Should construct an native DIV element', () => {
    const element = constructElement(div())
    expect(element).toBeDefined()
    expect(element.localName).toBe('div')
  })
  it('Should apply native element properties to the native DIV element', () => {
    const element = document.createElement('div')

    applyNativeElementProps(element, {
      tabIndex: 0,
      contentEditable: true,
      spellcheck: false,
    })

    expect(element.tabIndex).toBe(0)
    expect(element.contentEditable).toBe('true')
    expect(element.spellcheck).toBe(false)

    expect(element.getAttribute('tabindex')).toBe('0')
    expect(element.getAttribute('contenteditable')).toBe('true')
    expect(element.getAttribute('spellcheck')).toBe('false')

    applyNativeElementProps(element, {
      tabIndex: undefined,
      contentEditable: undefined,
      spellcheck: undefined,
    })

    expect(element.tabIndex).toBe(-1)
    expect(element.contentEditable).toBe('inherit')
    expect(element.spellcheck).toBe(true)

    expect(element.getAttribute('tabindex')).toBe(null)
    expect(element.getAttribute('contenteditable')).toBe(null)
    expect(element.getAttribute('spellcheck')).toBe(null)
  })
  it('Should reset properties to defaults if they are not in the props when the element is updated after initial applyNativeElementProps', () => {
    const element = document.createElement('div')
    applyNativeElementProps(element, {
      tabIndex: 0,
      contentEditable: true,
      spellcheck: false,
    })

    expect(element.tabIndex).toBe(0)
    expect(element.contentEditable).toBe('true')
    expect(element.spellcheck).toBe(false)

    expect(element.getAttribute('tabindex')).toBe('0')
    expect(element.getAttribute('contenteditable')).toBe('true')
    expect(element.getAttribute('spellcheck')).toBe('false')

    applyNativeElementProps(element, {
      tabIndex: 1,
      contentEditable: undefined,
      spellcheck: undefined,
    })

    expect(element.tabIndex).toBe(1)
    expect(element.contentEditable).toBe('inherit')
    expect(element.spellcheck).toBe(true)

    expect(element.getAttribute('tabindex')).toBe('1')
    expect(element.getAttribute('contenteditable')).toBe(null)
    expect(element.getAttribute('spellcheck')).toBe(null)
  })
  it('Should clear text content when reusing element with undefined children', () => {
    // This test verifies that when a span with text content is reused
    // for a vDOM element with undefined children, the text content is cleared.
    // Bug scenario: IoTab renders [span.drop-marker, span.label("Text"), ...]
    // When tab selection changes, positions shift and span.label becomes span.drop-marker
    // The text content "Text" should be cleared but wasn't due to the bug.

    @Register
    class TestVDOMClearChildren extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          showMarker: false,
        }
      }
      declare showMarker: boolean
      ready() {
        this.changed()
      }
      changed() {
        // Mimics IoTab render pattern where selected tab has a drop-marker span
        // and all tabs have a label span. When showMarker changes, the first
        // span switches between drop-marker (no children) and label (with text).
        if (this.showMarker) {
          this.render([
            span({class: 'drop-marker'}),  // no children - should be empty
            span({class: 'label'}, 'Label Text'),
          ])
        } else {
          this.render([
            span({class: 'label'}, 'Label Text'),
          ])
        }
      }
    }

    const element = new TestVDOMClearChildren()
    document.body.appendChild(element as unknown as HTMLElement)

    // Initial render without marker - just the label span
    expect(element.children.length).toBe(1)
    expect(element.children[0].className).toBe('label')
    expect(element.children[0].textContent).toBe('Label Text')

    // Now show marker - first span should be drop-marker with NO text content
    element.showMarker = true
    expect(element.children.length).toBe(2)
    expect(element.children[0].className).toBe('drop-marker')
    // BUG: The drop-marker span inherited text content from the previous label span
    // because it was reused (same tag 'span') and vChild.children was undefined
    expect(element.children[0].textContent).toBe('')  // This should pass after fix
    expect(element.children[1].className).toBe('label')
    expect(element.children[1].textContent).toBe('Label Text')

    element.remove()
  })
})

/**
 * Tests for VDOM element reuse behavior.
 *
 * Bug description: When rendering the same VDom instances consecutively,
 * the virtual DOM may create multiple DOM element instances instead of
 * reusing existing ones. This specifically manifests when:
 * - A new VDom wrapper object is created each render
 * - But the wrapper references shared children arrays from a cached widget
 */
describe('VDOM Element Reuse', () => {

  it('Should reuse DOM elements when rendering the same VDom array consecutively', () => {
    @Register
    class TestReuseConsecutive1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const element = new TestReuseConsecutive1()
    document.body.appendChild(element as unknown as HTMLElement)

    const vdom = [span({class: 'test-span'})]

    // First render
    element.renderWithVdom(vdom)
    expect(element.children.length).toBe(1)
    const firstRenderChild = element.children[0]

    // Second render with same VDom array
    element.renderWithVdom(vdom)
    expect(element.children.length).toBe(1)
    const secondRenderChild = element.children[0]

    // DOM element should be the same instance (reused, not recreated)
    expect(firstRenderChild).toBe(secondRenderChild)

    element.remove()
  })

  it('Should reuse DOM elements when rendering the same VDom object instance in multiple positions', () => {
    @Register
    class TestReuseSameInstance1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const element = new TestReuseSameInstance1()
    document.body.appendChild(element as unknown as HTMLElement)

    // Same VDom object instance used twice in the array
    const sharedVdom = span({class: 'shared'})
    const vdom = [sharedVdom, sharedVdom]

    // First render - should create 2 separate DOM elements
    element.renderWithVdom(vdom)
    expect(element.children.length).toBe(2)
    const firstChild1 = element.children[0]
    const firstChild2 = element.children[1]

    // Two different DOM elements should be created from the same VDom
    expect(firstChild1).not.toBe(firstChild2)
    expect(firstChild1.className).toBe('shared')
    expect(firstChild2.className).toBe('shared')

    // Second render with same array
    element.renderWithVdom(vdom)
    expect(element.children.length).toBe(2)
    const secondChild1 = element.children[0]
    const secondChild2 = element.children[1]

    // Both DOM elements should be reused
    expect(firstChild1).toBe(secondChild1)
    expect(firstChild2).toBe(secondChild2)

    element.remove()
  })

  /**
   * This test mimics the IoPropertyEditor widget pattern where:
   * 1. A widget VDom is cached
   * 2. On each render, a NEW wrapper object is created
   * 3. But the wrapper references the SAME children array from the cached widget
   *
   * Bug: This pattern causes multiple DOM instances to be created instead of reusing.
   */
  it('Should reuse elements when creating new VDom wrapper with shared children (widget pattern)', () => {
    @Register
    class TestWidgetPattern1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const element = new TestWidgetPattern1()
    document.body.appendChild(element as unknown as HTMLElement)

    // Simulates the cached widget - this object is created once and reused
    const cachedWidget: VDOMElement = {
      tag: 'div',
      props: { class: 'widget' },
      children: [
        { tag: 'span', props: { class: 'widget-child-1' } },
        { tag: 'span', props: { class: 'widget-child-2' } },
      ]
    }

    // First render - create a NEW wrapper object, but share children array
    const widgetWithValue1 = {
      tag: cachedWidget.tag,
      props: Object.assign({ value: 'test-value-1' }, cachedWidget.props),
      children: cachedWidget.children  // SAME children reference
    }
    element.renderWithVdom([widgetWithValue1])

    expect(element.children.length).toBe(1)
    const widgetDiv = element.children[0] as HTMLDivElement
    expect(widgetDiv.className).toBe('widget')
    expect(widgetDiv.children.length).toBe(2)

    const child1 = widgetDiv.children[0]
    const child2 = widgetDiv.children[1]
    expect(child1.className).toBe('widget-child-1')
    expect(child2.className).toBe('widget-child-2')

    // Second render - create ANOTHER NEW wrapper object, but SAME children array
    const widgetWithValue2 = {
      tag: cachedWidget.tag,
      props: Object.assign({ value: 'test-value-2' }, cachedWidget.props),
      children: cachedWidget.children  // SAME children reference
    }
    element.renderWithVdom([widgetWithValue2])

    expect(element.children.length).toBe(1)

    const widgetDivAfter = element.children[0] as HTMLDivElement
    expect(widgetDiv).toBe(widgetDivAfter)  // Parent should be reused

    expect(widgetDivAfter.children.length).toBe(2)
    const child1After = widgetDivAfter.children[0]
    const child2After = widgetDivAfter.children[1]

    // Children should also be reused
    expect(child1).toBe(child1After)
    expect(child2).toBe(child2After)

    // Third render - still should reuse
    const widgetWithValue3 = {
      tag: cachedWidget.tag,
      props: Object.assign({ value: 'test-value-3' }, cachedWidget.props),
      children: cachedWidget.children
    }
    element.renderWithVdom([widgetWithValue3])

    expect(element.children[0]).toBe(widgetDiv)
    expect((element.children[0] as HTMLElement).children[0]).toBe(child1)
    expect((element.children[0] as HTMLElement).children[1]).toBe(child2)

    element.remove()
  })

  it('Should reuse nested DOM elements when parent VDom is rendered consecutively', () => {
    @Register
    class TestReuseNested1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const element = new TestReuseNested1()
    document.body.appendChild(element as unknown as HTMLElement)

    const vdom = [
      div({class: 'parent'}, [
        span({class: 'child1'}),
        span({class: 'child2'}),
      ])
    ]

    // First render
    element.renderWithVdom(vdom)
    expect(element.children.length).toBe(1)
    const parentDiv = element.children[0]
    expect(parentDiv.children.length).toBe(2)
    const child1 = parentDiv.children[0]
    const child2 = parentDiv.children[1]

    // Second render with same VDom
    element.renderWithVdom(vdom)
    expect(element.children.length).toBe(1)
    const parentDiv2 = element.children[0]
    expect(parentDiv2.children.length).toBe(2)
    const child1After = parentDiv2.children[0]
    const child2After = parentDiv2.children[1]

    // All elements should be reused
    expect(parentDiv).toBe(parentDiv2)
    expect(child1).toBe(child1After)
    expect(child2).toBe(child2After)

    element.remove()
  })

  it('Should reuse elements when VDom array changes length and then returns to original', () => {
    @Register
    class TestReuseLengthChange1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const element = new TestReuseLengthChange1()
    document.body.appendChild(element as unknown as HTMLElement)

    // Start with 2 elements
    const vdom2 = [span({class: 'a'}), span({class: 'b'})]
    element.renderWithVdom(vdom2)
    expect(element.children.length).toBe(2)
    const childA = element.children[0]
    // childB captured for documentation but will be disposed when shrinking
    void element.children[1]

    // Shrink to 1 element
    const vdom1 = [span({class: 'a'})]
    element.renderWithVdom(vdom1)
    expect(element.children.length).toBe(1)
    expect(element.children[0]).toBe(childA) // First element should be reused

    // Grow back to 2 elements
    element.renderWithVdom(vdom2)
    expect(element.children.length).toBe(2)
    expect(element.children[0]).toBe(childA) // First element should still be reused
    // Note: childB was disposed, so children[1] will be a new element

    element.remove()
  })

  it('Should properly reuse elements when same VDom array is rendered in rapid succession', () => {
    @Register
    class TestReuseRapid1 extends IoElement {
      renderCount = 0
      renderWithVdom(vdom: any[]) {
        this.renderCount++
        this.render(vdom)
      }
    }

    const element = new TestReuseRapid1()
    document.body.appendChild(element as unknown as HTMLElement)

    const vdom = [span({class: 'rapid'})]

    // First render to establish baseline
    element.renderWithVdom(vdom)
    const firstChild = element.children[0]

    // Rapid succession of renders with same VDom
    for (let i = 0; i < 10; i++) {
      element.renderWithVdom(vdom)
    }

    expect(element.renderCount).toBe(11)
    expect(element.children.length).toBe(1)

    // Element should still be the same instance
    expect(element.children[0]).toBe(firstChild)

    element.remove()
  })

  it('Should reuse elements when VDom props change but structure remains same', () => {
    @Register
    class TestReusePropsChange1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const element = new TestReusePropsChange1()
    document.body.appendChild(element as unknown as HTMLElement)

    // First render
    element.renderWithVdom([span({class: 'initial', title: 'first'})])
    expect(element.children.length).toBe(1)
    const child = element.children[0] as HTMLSpanElement
    expect(child.className).toBe('initial')
    expect(child.title).toBe('first')

    // Same structure, different props - element should be reused
    element.renderWithVdom([span({class: 'updated', title: 'second'})])
    expect(element.children.length).toBe(1)
    const childAfter = element.children[0] as HTMLSpanElement

    // Same DOM element, updated props
    expect(child).toBe(childAfter)
    expect(childAfter.className).toBe('updated')
    expect(childAfter.title).toBe('second')

    element.remove()
  })

  /**
   * This test specifically targets the bug where creating NEW VDom wrapper
   * objects on each render (even with same children) causes duplicate instances.
   */
  it('Should NOT create duplicate elements when new VDom wrappers share same children array', () => {
    @Register
    class TestDuplicateBug1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const element = new TestDuplicateBug1()
    document.body.appendChild(element as unknown as HTMLElement)

    // Shared children array (like widget.children in IoPropertyEditor)
    const sharedChildren: VDOMElement[] = [
      { tag: 'span', props: { class: 'shared-child' } }
    ]

    const instanceTracker: Element[] = []

    // Helper to render with new wrapper
    const renderNewWrapper = () => {
      // Each render creates a NEW wrapper object (like widgetWithValue)
      // but references the SAME children array
      const newWrapper: VDOMElement = {
        tag: 'div',
        props: { class: 'wrapper' },
        children: sharedChildren
      }

      element.renderWithVdom([newWrapper])

      // Track all instances created
      if (element.children[0]) {
        const wrapperEl = element.children[0] as HTMLElement
        if (wrapperEl.children[0] && !instanceTracker.includes(wrapperEl.children[0])) {
          instanceTracker.push(wrapperEl.children[0])
        }
      }
    }

    // Initial render
    renderNewWrapper()
    expect(element.children.length).toBe(1)
    expect((element.children[0] as HTMLElement).children.length).toBe(1)
    expect(instanceTracker.length).toBe(1)
    const originalChild = instanceTracker[0]

    // Multiple renders - each creates new wrapper, same children
    for (let i = 0; i < 5; i++) {
      renderNewWrapper()
    }

    // BUG: If this fails, it means new DOM instances are being created
    // when they should be reused
    expect(instanceTracker.length).toBe(1)
    expect((element.children[0] as HTMLElement).children[0]).toBe(originalChild)

    element.remove()
  })

  /**
   * This test uses IoElement children (custom elements), which is what
   * IoPropertyEditor widgets typically are. The handling differs between
   * IoElement and native elements in the traverse function.
   */
  it('Should reuse IoElement children when rendering widget pattern with custom elements', () => {
    // Define a custom IoElement to use as widget
    @Register
    class TestWidgetElement1 extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          value: null,
        }
      }
      declare value: any
      instanceId = Math.random()  // Unique ID to track instance identity
    }

    @Register
    class TestParentWithWidget1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const parent = new TestParentWithWidget1()
    document.body.appendChild(parent as unknown as HTMLElement)

    // Simulates the cached widget VDom (like what getEditorWidget returns)
    const cachedWidgetVdom: VDOMElement = {
      tag: 'test-widget-element1',
      props: { class: 'widget' },
      children: undefined  // IoElements manage their own children
    }

    // First render - create a NEW wrapper object (like widgetWithValue)
    const widgetWithValue1: VDOMElement = {
      tag: cachedWidgetVdom.tag,
      props: Object.assign({ value: { foo: 'bar' } }, cachedWidgetVdom.props),
      children: cachedWidgetVdom.children
    }
    parent.renderWithVdom([widgetWithValue1])

    expect(parent.children.length).toBe(1)
    const widget1 = parent.children[0] as TestWidgetElement1
    expect(widget1.localName).toBe('test-widget-element1')
    expect(widget1.value).toEqual({ foo: 'bar' })
    const originalInstanceId = widget1.instanceId

    // Second render - create ANOTHER NEW wrapper object, but same widget tag
    const widgetWithValue2: VDOMElement = {
      tag: cachedWidgetVdom.tag,
      props: Object.assign({ value: { foo: 'baz' } }, cachedWidgetVdom.props),
      children: cachedWidgetVdom.children
    }
    parent.renderWithVdom([widgetWithValue2])

    expect(parent.children.length).toBe(1)
    const widget2 = parent.children[0] as TestWidgetElement1

    // BUG: If widget2.instanceId !== originalInstanceId, then a new instance
    // was created instead of reusing the existing one
    expect(widget2.instanceId).toBe(originalInstanceId)
    expect(widget2.value).toEqual({ foo: 'baz' })  // Props should be updated

    // Multiple renders
    for (let i = 0; i < 5; i++) {
      const widgetWithValueN: VDOMElement = {
        tag: cachedWidgetVdom.tag,
        props: Object.assign({ value: { count: i } }, cachedWidgetVdom.props),
        children: cachedWidgetVdom.children
      }
      parent.renderWithVdom([widgetWithValueN])
    }

    expect(parent.children.length).toBe(1)
    const widgetFinal = parent.children[0] as TestWidgetElement1
    expect(widgetFinal.instanceId).toBe(originalInstanceId)

    parent.remove()
  })

  /**
   * Test the exact pattern from IoPropertyEditor where widget has children
   * that are shared across renders.
   */
  it('Should reuse IoElement widget with nested native children', () => {
    @Register
    class TestWidgetWithChildren1 extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          value: null,
        }
      }
      declare value: any
      instanceId = Math.random()
    }

    @Register
    class TestParentWithNestedWidget1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const parent = new TestParentWithNestedWidget1()
    document.body.appendChild(parent as unknown as HTMLElement)

    // Cached widget with children (like what getEditorWidget might return)
    const sharedChildren: VDOMElement[] = [
      { tag: 'span', props: { class: 'label' } },
      { tag: 'input', props: { type: 'text' } },
    ]

    const cachedWidgetVdom: VDOMElement = {
      tag: 'test-widget-with-children1',
      props: { class: 'widget' },
      children: sharedChildren
    }

    // First render
    const widgetWithValue1: VDOMElement = {
      tag: cachedWidgetVdom.tag,
      props: Object.assign({ value: 'first' }, cachedWidgetVdom.props),
      children: cachedWidgetVdom.children  // SAME children reference
    }
    parent.renderWithVdom([widgetWithValue1])

    expect(parent.children.length).toBe(1)
    const widget = parent.children[0] as TestWidgetWithChildren1
    const originalInstanceId = widget.instanceId

    // Second render - new wrapper, same children array
    const widgetWithValue2: VDOMElement = {
      tag: cachedWidgetVdom.tag,
      props: Object.assign({ value: 'second' }, cachedWidgetVdom.props),
      children: cachedWidgetVdom.children  // SAME children reference
    }
    parent.renderWithVdom([widgetWithValue2])

    expect(parent.children.length).toBe(1)
    const widgetAfter = parent.children[0] as TestWidgetWithChildren1

    // Widget should be reused
    expect(widgetAfter.instanceId).toBe(originalInstanceId)
    expect(widgetAfter.value).toBe('second')

    parent.remove()
  })

  /**
   * Test that simulates the debounced render pattern in IoPropertyEditor
   */
  it('Should handle multiple debounced renders without creating duplicates', async () => {
    @Register
    class TestWidgetElement2 extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          value: null,
        }
      }
      declare value: any
      instanceId = Math.random()
    }

    @Register
    class TestDebouncedParent1 extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          data: null,
        }
      }
      declare data: any

      // Simulates IoPropertyEditor's _widget property
      private cachedWidget: VDOMElement = {
        tag: 'test-widget-element2',
        props: { class: 'cached-widget' },
      }

      renderWidget() {
        // Simulates configureDebounced pattern
        const widgetWithValue: VDOMElement = {
          tag: this.cachedWidget.tag,
          props: Object.assign({ value: this.data }, this.cachedWidget.props),
          children: this.cachedWidget.children
        }
        this.render([widgetWithValue])
      }
    }

    const parent = new TestDebouncedParent1()
    document.body.appendChild(parent as unknown as HTMLElement)

    // Initial render
    parent.data = { count: 0 }
    parent.renderWidget()

    expect(parent.children.length).toBe(1)
    const widget = parent.children[0] as TestWidgetElement2
    const originalId = widget.instanceId

    // Simulate rapid data changes that would trigger debounced renders
    for (let i = 1; i <= 10; i++) {
      parent.data = { count: i }
      parent.renderWidget()
    }

    expect(parent.children.length).toBe(1)
    const finalWidget = parent.children[0] as TestWidgetElement2

    // Same instance should be reused throughout
    expect(finalWidget.instanceId).toBe(originalId)
    expect(finalWidget.value).toEqual({ count: 10 })

    parent.remove()
  })

  /**
   * Diagnostic test: Verify widget renders its own children during construction
   */
  it('DIAGNOSTIC: Widget should render children via ready() -> changed()', () => {
    @Register
    class TestDiagnosticWidget1 extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          value: null,
        }
      }
      declare value: any

      ready() {
        this.changed()
      }

      changed() {
        this.render([
          span({class: 'diag-child-1'}),
          span({class: 'diag-child-2'}),
        ])
      }
    }

    // Create widget directly, not via parent
    const widget = new TestDiagnosticWidget1()
    document.body.appendChild(widget as unknown as HTMLElement)

    // Widget should have 2 children from its changed() method
    expect(widget.children.length).toBe(2)
    expect(widget.children[0].className).toBe('diag-child-1')
    expect(widget.children[1].className).toBe('diag-child-2')

    widget.remove()
  })

  /**
   * Test: Parent should NOT traverse IoElement children even when vChild.children is an array.
   *
   * Scenario:
   * 1. IoElement widget renders its own children via ready() -> changed() -> render()
   * 2. Parent renders widget with vChild.children = [] (empty array)
   * 3. Parent's traverse should NOT override widget's internally-rendered children
   */
  it('Parent should NOT traverse IoElement children even when vChild.children is an array', () => {
    // Widget that renders its own children via ready() -> changed()
    @Register
    class TestSelfRenderingWidget1 extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          value: null,
        }
      }
      declare value: any

      ready() {
        this.changed()
      }

      changed() {
        // Widget renders its own children - this is standard IoElement pattern
        this.render([
          span({class: 'internal-child-1'}),
          span({class: 'internal-child-2'}),
        ])
      }
    }

    @Register
    class TestParentWithExplicitChildren1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const parent = new TestParentWithExplicitChildren1()
    document.body.appendChild(parent as unknown as HTMLElement)

    // Parent renders widget WITH explicit children: [] (empty array)
    // Note: tag must match the auto-generated name (hyphen before numbers)
    const widgetVdom: VDOMElement = {
      tag: 'test-self-rendering-widget-1',
      props: { value: 'test' },
      children: []  // Empty array should NOT override widget's children
    }

    parent.renderWithVdom([widgetVdom])

    expect(parent.children.length).toBe(1)
    const widget = parent.children[0] as TestSelfRenderingWidget1

    // Widget should have 2 children (rendered by its changed() method)
    expect(widget.children.length).toBe(2)
    expect(widget.children[0].className).toBe('internal-child-1')
    expect(widget.children[1].className).toBe('internal-child-2')

    parent.remove()
  })

  /**
   * Test: Parent should NOT override IoElement internal children with vChild.children array.
   */
  it('Parent should NOT override IoElement internal children with vChild.children array', () => {
    @Register
    class TestSelfRenderingWidget2 extends IoElement {
      static get ReactiveProperties(): ReactivePropertyDefinitions {
        return {
          value: null,
        }
      }
      declare value: any

      ready() {
        this.changed()
      }

      changed() {
        // Widget renders 3 children internally
        this.render([
          span({class: 'widget-child-a'}),
          span({class: 'widget-child-b'}),
          span({class: 'widget-child-c'}),
        ])
      }
    }

    @Register
    class TestParentWithMismatchedChildren1 extends IoElement {
      renderWithVdom(vdom: any[]) {
        this.render(vdom)
      }
    }

    const parent = new TestParentWithMismatchedChildren1()
    document.body.appendChild(parent as unknown as HTMLElement)

    // Parent renders widget with DIFFERENT children array
    // This simulates a misconfigured widget registration
    // Note: tag must match the auto-generated name (hyphen before numbers)
    const widgetVdom: VDOMElement = {
      tag: 'test-self-rendering-widget-2',  // <-- hyphen before 2
      props: { value: 'test' },
      children: [
        { tag: 'div', props: { class: 'external-child' } }  // Different from what widget renders!
      ]
    }

    parent.renderWithVdom([widgetVdom])

    expect(parent.children.length).toBe(1)
    const widget = parent.children[0] as TestSelfRenderingWidget2

    // The widget's internal children should take precedence
    // because IoElements manage their own children
    // BUG: If this fails, parent's traverse is overriding widget's children
    expect(widget.children.length).toBe(3)  // Widget renders 3 children
    expect(widget.children[0].className).toBe('widget-child-a')
    expect(widget.children[1].className).toBe('widget-child-b')
    expect(widget.children[2].className).toBe('widget-child-c')

    parent.remove()
  })
})

## IoElement

Core `IoElement` class.

### .connectedCallback()

Add resize listener if `onResized()` is defined in subclass.

### .disconnectedCallback()

Removes resize listener if `onResized()` is defined in subclass.

### .template(vDOM: `Array`, host: `HTMLElement`)

Renders DOM from virtual DOM arrays.

### .traverse(vChildren: `Array`, host: `HTMLElement`)

Recurively traverses vDOM.

### .flattenTextNode(element: `HTMLElement`)

Helper function to flatten textContent into a single TextNode.
Update textContent via TextNode is better for layout performance.

### .setAttribute(attr: `string`, value: `*`)

Alias for HTMLElement setAttribute where falsey values remove the attribute.

### .applyAria()

Sets aria attributes.

### .RegisterIoElement()

Register function for `IoElement`. Registers custom element.

### .constructElement(vDOMNode: `Object`, vDOMNode.name: `string`, vDOMNode.props: `Object`) : HTMLElement

Creates an element from a virtual dom object.

### .setNativeElementProps(element: `HTMLElement`, props: `Object`)

Sets element properties.


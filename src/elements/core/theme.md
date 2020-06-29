## `IoThemeSingleton`

Extends `Node`.

`IoThemeSingleton` holds top-level CSS variables for Io design system. Variables are grouped in different themes and can be collectively switched by changing `theme` property.

```javascript
IoThemeSingleton.theme = 'dark';
```

<io-element-demo element="io-option-menu" properties='{"value": "light", "options": ["light", "dark"]}'></io-element-demo>

Moreover, some of the key theme variables such as `'--io-color'` and `'--io-background-color'` are mapped to numeric properties `cssColor` and `cssBackgroundColor` source code for more advanced example.
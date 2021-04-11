## `IoIconsetSingleton`

Extends `IoNode`.

Global database for SVG assets to be used with `IoIcon`. Icons are registered using `namespace` and `id` attribute.

```javascript
import {IoIconsetSingleton} from "./path_to/iogui.js";
const svgString = `<svg><g id="myicon"><path d="..."/></g></svg>`;

/* register icons under "custom" namespace */
IoIconsetSingleton.registerIcons('custom', svgString);
/* retrieve specific icon */
const icon = IoIconsetSingleton.getIcon('custom:myicon');
```
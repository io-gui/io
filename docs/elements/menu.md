Option select element.

<io-element-demo element="io-menu" properties='{"button": 0, "position": "pointer", "options": [{"label": "Red", "icon": "❤️", "options": [0,1,2]}, {"label": "Green", "icon": "💚", "options": [0,1,2]}, {"label": "Blue", "icon": "💙", "options": [0,1,2]}]}' config='{"button": ["io-option", {"options": [0, 1, 2]}], "position": ["io-option", {"options": ["pointer", "top", "right", "bottom", "left"]}]}'></io-element-demo>

<io-element-demo element="io-menu-options" properties='{"horizontal": false, "expanded": true, "options": [{"label": "Red", "icon": "❤️", "options": [0,1,2]}, {"label": "Green", "icon": "💚", "options": [0,1,2]}, {"label": "Blue", "icon": "💙", "options": [0,1,2]}]}'></io-element-demo>

<io-element-demo element="io-menu-item" properties='{"value": "", "label": "Hearts", "icon": "❤", "hint": "more", "position": "right", "options": ["❤️", "💚", "💙"]}' config='{"position": ["io-option", {"options": ["top", "right", "bottom", "left"]}]}'></io-element-demo>

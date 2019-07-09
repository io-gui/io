## io-collapsable ##

An element with collapsable content.

Implements `<io-boolean>`.

<io-element-demo element="io-collapsable" properties='{"label": "Collapsable", "expanded": true, "elements": [["div", "Content"]]}'></io-element-demo>

When clicked or activated by space/enter key, it toggles the visibility of the child elements defined as `elements` property.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`label`**    | String  | Expand/collapse button text                | `''`  |
| **`expanded`** | Boolean | Expanded state                             | `false` |
| **`elements`** | Array   | Elements to add as children when expanded  | `[]` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## io-selector ##

Element selector. Displays one of the virtual elements assigned in the `elements` property as its child if the name of the element matches the `value` property.

<io-element-demo element="io-selector" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"]], "selected": "first", "cache": false, "precache": false}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

If `cache` property is set to `true`, a reference to the element will be kept fo later use.

If `precache` property is set to `true`, all elements will be created for immediate use.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`elements`** | Array    | Array with virtual elements | `[]`    |
| **`selected`** | String   | Selected element            | `''`    |
| **`scrollid`** | String   | Scrolled element id         | `''`    |
| **`cache`**    | Boolean  | Cache elements for reuse    | `false` |
| **`precache`** | Boolean  | Precache elements           | `false` |

&nbsp;

## io-selector-tabs ##

Element selector with selectable tabs interfce. Extends `<io-selector>`.

Extends `<io-selector>`. Implements `<io-tabs>`.

<io-element-demo element="io-selector-tabs" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"], ["div", {"name": "fifth"}, "Fifth content"], ["div", {"name": "sixth"}, "Sixth content"]], "selected": "first", "cache": false, "precache": false, "options": ["first", "second", "third", "fourth", {"label" : "more", "options": ["fifth", "sixth"]}]}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`options`** | Array    | Filtered element options    | `[]`    |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## io-selector-sidebar ##

Element selector with selectable sidebar interfce. Extends `<io-selector>`.

Extends `<io-selector>`. Implements `<io-sidebar>`.

<io-element-demo element="io-selector-sidebar" properties='{"elements": [["div", {"name": "first"}, "First content"], ["div", {"name": "second"}, "Second content"], ["div", {"name": "third"}, "Third content"], ["div", {"name": "fourth"}, "Fourth content"]], "selected": "first", "cache": false, "precache": false, "options": [{"label": "elements", "options": ["first", "second", "third", "fourth"]}], "left": true, "minWidth": 410}' config='{"selected": ["io-option", {"options": ["first", "second", "third", "fourth"]}]}'></io-element-demo>

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`options`**  | Array    | Filtered element options    | `[]`    |
| **`left`**     | Boolean  | Sidebar on the left side    | `true`  |
| **`minWidth`** | Number   | Sidebar collapse width      | `410`   |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## io-sidebar ##

Labeled tabs for selection.

Implements `<io-option>` and `<io-button>`.

<io-element-demo element="io-sidebar" properties='{"selected": 1, "options": [1,2,3], "overflow": false}'></io-element-demo>

<io-element-demo element="io-sidebar" properties='{"selected": 1, "options": [{"label": "Options", "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}]}], "overflow": false}'></io-element-demo>

When tabs are clicked, `selected` value is set.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`selected`** | String   | Current value      | `` |
| **`options`**  | Array    | Array with options | `[]` |

**Events**

| Event | Description | Detail | Bubbles |
|:------|:------------|:-------|:--------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false |

&nbsp;

## io-breadcrumbs ##

Breadcrumbs select element.

Implements `<io-button>`.

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [1,2,3], "trim": false}'></io-element-demo>

<io-element-demo element="io-breadcrumbs" properties='{"value": 1, "options": [{"value": 1, "label": "one"}, {"value": 2, "label": "two"}, {"value": 3, "label": "three"}], "trim": true}'></io-element-demo>

When breadcrumb item is clicked or activated by space/enter key, it sets the value to corresponding option value. Optionally, it can trim the `options` array to selected option index.

**Properties**

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`options`** | Array    | Array with options          | `[]` |
| **`trim`**    | Boolean  | Trim options to value index | `false` |

**Events**

| Event | Description | Detail | Bubbles | Source |
|:------|:------------|:-------|:--------|:-------|
| **`value-set`** | Value set by user action | `property`, `value`, `oldValue` | false ||
| **`object-mutated`** | Value set by user action | `object`, `property`, `value`, `oldValue` | false | window |

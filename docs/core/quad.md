WebGL canvas for rendering elements as shaders.

<io-element-demo element="io-quad" properties='{"background": [0, 0, 0, 1], "color": [1, 1, 1, 1], "size": [257, 257]}' config='{"size": ["io-properties", {"config": {"type:number": ["io-slider", {"min": 0, "max": 100, "step": 0.01}]}}]}'></io-element-demo>

This is a base class for WebGL shader elemenents.

The element will automatically create shader uniforms for `Number` and `Array` properties and update canvas on property change.

You can define custom shader code in `static get vert()` and `static get frag()` return string.

See `IoSliderKnob` for custom shader example.

#### Properties ####

| Property | Type | Description | Default |
|:---------|:-----|:------------|:--------|
| **`background`** | Array    | Background color   | `[0, 0, 0, 1]` |
| **`color`**      | Array    | Foreground color   | `[1, 1, 1, 1]` |
| **`size`**       | Array    | Canvas size        | `[0, 0]`       |

#### Events ####

| Event | Description | Detail | Bubbles | Source |
|:------|:------------|:-------|:--------|:-------|
| **`object-mutated`** | Value set by user action | `object: this.size` | false | window |

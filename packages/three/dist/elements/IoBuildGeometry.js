var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty } from '@io-gui/core';
import { ioButton } from '@io-gui/inputs';
import { ioPropertyEditor } from '@io-gui/editors';
let IoBuildGeometry = class IoBuildGeometry extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
      }
    `;
    }
    constructor(args = {}) {
        super(args);
    }
    buildGeometry() {
        const geometry = this.value;
        if (!geometry)
            return;
        const parameters = geometry.parameters;
        if (!parameters) {
            debug: {
                console.warn('IoBuildGeometry: geometry has no parameters property');
            }
            return;
        }
        const GeometryClass = geometry.constructor;
        const parameterValues = Object.values(parameters);
        const newGeometry = new GeometryClass(...parameterValues);
        geometry.copy(newGeometry);
        newGeometry.dispose();
        geometry.computeVertexNormals();
        geometry.computeTangents();
        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();
        this.dispatchMutation(geometry);
        this.dispatchMutation(geometry.boundingBox);
        this.dispatchMutation(geometry.boundingSphere);
    }
    changed() {
        const hasParameters = this.value && this.value.parameters;
        this.render([
            ioPropertyEditor({
                value: this.value,
                properties: ['parameters'],
                labeled: false,
            }),
            ioButton({
                label: 'Build Geometry',
                action: () => this.buildGeometry(),
                disabled: !hasParameters,
            }),
            ioButton({
                label: 'Compute Vertex Normals',
                action: () => {
                    this.value?.computeVertexNormals();
                },
            }),
            ioButton({
                label: 'Compute Tangents',
                action: () => {
                    this.value?.computeTangents();
                },
            }),
            ioButton({
                label: 'Compute Bounding Sphere',
                action: () => {
                    this.value?.computeBoundingSphere();
                    this.dispatchMutation(this.value.boundingSphere);
                    this.dispatchMutation(this.value.boundingSphere.center);
                },
            }),
            ioButton({
                label: 'Compute Bounding Box',
                action: () => {
                    this.value?.computeBoundingBox();
                    this.dispatchMutation(this.value.boundingBox.max);
                    this.dispatchMutation(this.value.boundingBox.min);
                },
            }),
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoBuildGeometry.prototype, "value", void 0);
IoBuildGeometry = __decorate([
    Register
], IoBuildGeometry);
export { IoBuildGeometry };
export const ioBuildGeometry = function (arg0) {
    return IoBuildGeometry.vConstructor(arg0);
};
//# sourceMappingURL=IoBuildGeometry.js.map